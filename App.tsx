
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import StaffSidebar from './components/StaffSidebar';
import ScheduleGrid from './components/ScheduleGrid';
import Dashboard from './components/Dashboard';
import { MOCK_STAFF, MOCK_SHIFTS } from './constants';
import { Shift, Staff, ShiftType } from './types';
import { getSchedulingInsights } from './geminiService';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'schedule' | 'dashboard'>('schedule');
  
  // Modal State
  const [activeCell, setActiveCell] = useState<{ staff: Staff; date: string } | null>(null);

  const [currentViewDate, setCurrentViewDate] = useState(new Date(2023, 9, 1)); // Oct 2023

  const monthDates = useMemo(() => {
    const dates = [];
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }
    return dates;
  }, [currentViewDate]);

  const filteredStaff = useMemo(() => {
    return staff.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staff, searchTerm]);

  const handleDeleteStaff = (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายชื่อนี้ออกจากตาราง?')) {
      setStaff(prev => prev.filter(s => s.id !== id));
      setShifts(prev => prev.filter(sh => sh.staffId !== id));
    }
  };

  const handleEditStaff = (staffToEdit: Staff) => {
    const newName = window.prompt('แก้ไขชื่อ:', staffToEdit.name);
    if (newName !== null) {
      const newRole = window.prompt('แก้ไขตำแหน่ง:', staffToEdit.role);
      if (newRole !== null) {
        setStaff(prev => prev.map(s => 
          s.id === staffToEdit.id ? { ...s, name: newName, role: newRole } : s
        ));
      }
    }
  };

  const handleCellClick = (staff: Staff, date: string) => {
    setActiveCell({ staff, date });
  };

  const handleUpdateCell = (type: 'DAY' | 'NIGHT' | 'LEAVE' | 'CLEAR') => {
    if (!activeCell) return;

    const { staff: targetStaff, date } = activeCell;

    if (type === 'LEAVE') {
      setStaff(prev => prev.map(s => {
        if (s.id === targetStaff.id) {
          const currentUn = s.unavailability || [];
          if (!currentUn.includes(date)) {
            return { ...s, unavailability: [...currentUn, date] };
          }
        }
        return s;
      }));
      setShifts(prev => prev.filter(sh => !(sh.staffId === targetStaff.id && sh.date === date)));
    } else if (type === 'CLEAR') {
      setStaff(prev => prev.map(s => {
        if (s.id === targetStaff.id) {
          return { ...s, unavailability: (s.unavailability || []).filter(d => d !== date) };
        }
        return s;
      }));
      setShifts(prev => prev.filter(sh => !(sh.staffId === targetStaff.id && sh.date === date)));
    } else {
      const shiftType = type === 'DAY' ? ShiftType.DAY : ShiftType.NIGHT;
      const startTime = type === 'DAY' ? '07:00' : '19:00';
      const endTime = type === 'DAY' ? '19:00' : '07:00';

      setStaff(prev => prev.map(s => {
        if (s.id === targetStaff.id) {
          return { ...s, unavailability: (s.unavailability || []).filter(d => d !== date) };
        }
        return s;
      }));

      setShifts(prev => {
        const filtered = prev.filter(sh => !(sh.staffId === targetStaff.id && sh.date === date));
        return [...filtered, {
          id: `man-${date}-${targetStaff.id}-${type}`,
          staffId: targetStaff.id,
          date,
          type: shiftType,
          startTime,
          endTime,
          zone: 'ICU / General'
        }];
      });
    }

    setActiveCell(null);
  };

  const handleGenerateSchedule = (month: number, year: number) => {
    if (staff.length === 0) {
      alert('กรุณาเพิ่มรายชื่อบุคลากรอย่างน้อย 1 คนก่อนจัดตาราง');
      return;
    }
    
    setIsGenerating(true);
    setCurrentViewDate(new Date(year, month, 1));
    setActiveTab('schedule'); // Switch to schedule to see result

    setTimeout(() => {
      const newShifts: Shift[] = [];
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      let staffRotationIndex = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const shiftsPerDay = [
          { type: ShiftType.DAY, start: '07:00', end: '19:00', count: 2 },
          { type: ShiftType.NIGHT, start: '19:00', end: '07:00', count: 1 }
        ];

        shiftsPerDay.forEach(config => {
          let assignedCount = 0;
          let attempts = 0;
          while (assignedCount < config.count && attempts < staff.length) {
            const currentStaff = staff[staffRotationIndex % staff.length];
            const isUnavailable = currentStaff.unavailability?.includes(dateStr);
            if (!isUnavailable) {
              newShifts.push({
                id: `gen-${dateStr}-${currentStaff.id}-${config.type}`,
                staffId: currentStaff.id,
                date: dateStr,
                type: config.type,
                startTime: config.start,
                endTime: config.end,
                zone: 'ICU / General'
              });
              assignedCount++;
            }
            staffRotationIndex++;
            attempts++;
          }
        });
      }
      setShifts(newShifts);
      setIsGenerating(false);
    }, 1000);
  };

  const generateInsights = async () => {
    setLoadingInsights(true);
    const text = await getSchedulingInsights(staff, shifts);
    setInsights(text || "ขออภัย ไม่สามารถสร้างข้อมูลเชิงลึกได้ในขณะนี้");
    setLoadingInsights(false);
  };

  const thaiMonthsFull = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  return (
    <Layout 
      activeTab={activeTab}
      onTabChange={setActiveTab}
      sidebar={
        <StaffSidebar 
          staffList={filteredStaff} 
          onSearch={setSearchTerm}
          onGenerateSchedule={handleGenerateSchedule}
          isGenerating={isGenerating}
        />
      }
    >
      {activeTab === 'schedule' ? (
        <>
          <div className="flex flex-col border-b border-[#e5e7eb] dark:border-gray-800 p-6 gap-6 bg-white dark:bg-[#111418]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 text-[#617589]">
                  <span className="material-symbols-outlined text-base">apartment</span>
                  <p className="text-sm font-medium">โรงพยาบาลเทพสตรี - แผนก ICU</p>
                  <span className="mx-1">|</span>
                  <div className="flex items-center text-sm font-bold text-primary">
                    {thaiMonthsFull[currentViewDate.getMonth()]} {currentViewDate.getFullYear() + 543}
                  </div>
                </div>
                <h1 className="text-[#111418] dark:text-white text-3xl font-extrabold leading-tight">ระบบจัดการตารางเวร</h1>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={generateInsights}
                  disabled={loadingInsights || shifts.length === 0}
                  className="flex items-center justify-center rounded-lg h-10 px-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold shadow-sm hover:bg-emerald-100 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg mr-2">psychology</span>
                  วิเคราะห์ความคุ้มค่า
                </button>
                <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors">
                  <span className="material-symbols-outlined text-lg mr-2">send</span>
                  ประกาศตารางเวร
                </button>
              </div>
            </div>

            {insights && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-4">
                <span className="material-symbols-outlined text-emerald-600">info</span>
                <div className="text-sm text-emerald-800 leading-relaxed">
                  <p className="font-bold mb-1">ผลการวิเคราะห์จากระบบ:</p>
                  {insights}
                </div>
                <button onClick={() => setInsights(null)} className="ml-auto text-emerald-400 hover:text-emerald-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}
          </div>

          <ScheduleGrid 
            staffList={filteredStaff} 
            shifts={shifts} 
            dates={monthDates} 
            onDeleteStaff={handleDeleteStaff}
            onEditStaff={handleEditStaff}
            onCellClick={handleCellClick}
          />
        </>
      ) : (
        <Dashboard staffList={staff} shifts={shifts} />
      )}

      {/* Action Modal */}
      {activeCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-full size-12" 
                  style={{ backgroundImage: `url("${activeCell.staff.avatar}")` }}
                ></div>
                <div>
                  <h3 className="font-bold text-lg">{activeCell.staff.name}</h3>
                  <p className="text-sm text-gray-500">จัดการเวรวันที่: {activeCell.date}</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <button 
                onClick={() => handleUpdateCell('DAY')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 transition-colors group"
              >
                <span className="material-symbols-outlined bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">sunny</span>
                <span className="font-bold">ลงเวรเช้า (07:00 - 19:00)</span>
              </button>
              <button 
                onClick={() => handleUpdateCell('NIGHT')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-700 transition-colors group"
              >
                <span className="material-symbols-outlined bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg group-hover:bg-indigo-200 transition-colors">dark_mode</span>
                <span className="font-bold">ลงเวรดึก (19:00 - 07:00)</span>
              </button>
              <button 
                onClick={() => handleUpdateCell('LEAVE')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors group"
              >
                <span className="material-symbols-outlined bg-red-100 dark:bg-red-900/40 p-2 rounded-lg group-hover:bg-red-200 transition-colors">person_off</span>
                <span className="font-bold">แจ้งลาหยุด (ลากิจ/ลาพัก)</span>
              </button>
              <button 
                onClick={() => handleUpdateCell('CLEAR')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 transition-colors group"
              >
                <span className="material-symbols-outlined bg-gray-100 dark:bg-gray-800 p-2 rounded-lg group-hover:bg-gray-200 transition-colors">backspace</span>
                <span className="font-medium">ล้างข้อมูลในวันนี้</span>
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
              <button 
                onClick={() => setActiveCell(null)}
                className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
