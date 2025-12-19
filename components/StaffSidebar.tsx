
import React, { useState } from 'react';
import { Staff, SchedulingRequest, RequestStatus } from '../types';

interface StaffSidebarProps {
  staffList: Staff[];
  onSearch: (term: string) => void;
  onGenerateSchedule: (month: number, year: number) => void;
  isGenerating: boolean;
}

const StaffSidebar: React.FC<StaffSidebarProps> = ({ 
  staffList, 
  onSearch,
  onGenerateSchedule,
  isGenerating
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-[#e5e7eb] dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base">รายชื่อบุคลากร</h3>
          <button className="text-primary text-sm font-medium hover:underline">+ เพิ่มใหม่</button>
        </div>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#617589]">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
          </div>
          <input 
            className="block w-full p-2.5 pl-10 text-sm text-[#111418] dark:text-white bg-[#f0f2f4] dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-[#617589]" 
            placeholder="ค้นหาชื่อ..." 
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {staffList.map((s) => {
          const statusColors = {
            online: 'bg-emerald-500',
            away: 'bg-amber-500',
            offline: 'bg-gray-400'
          };
          const progress = Math.min((s.hoursWorked / s.maxHours) * 100, 100);
          const isOver = s.hoursWorked > s.maxHours;

          return (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f0f2f4] dark:hover:bg-gray-800 transition-colors cursor-pointer border border-transparent">
              <div className="relative">
                <div 
                  className={`bg-center bg-no-repeat bg-cover rounded-full size-10 ${s.status === 'offline' ? 'grayscale opacity-70' : ''}`} 
                  style={{ backgroundImage: `url("${s.avatar}")` }}
                ></div>
                <span className={`absolute bottom-0 right-0 size-3 rounded-full ${statusColors[s.status]} border-2 border-white dark:border-[#111418]`}></span>
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <p className="text-sm font-bold text-[#111418] dark:text-white truncate">{s.name}</p>
                <p className="text-xs text-[#617589] dark:text-gray-400 truncate">{s.role}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-xs font-bold ${isOver ? 'text-red-500' : 'text-[#111418] dark:text-white'}`}>{s.hoursWorked}ชั่วโมง</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-[#e5e7eb] dark:border-gray-800 bg-[#f8fafc] dark:bg-[#0d131a]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#617589] uppercase tracking-wider">จัดตารางเวรอัตโนมัติ</span>
          <span className="material-symbols-outlined text-primary text-lg">event_note</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#617589] mb-1 block">เลือกเดือนที่ต้องการจัด</label>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full text-sm rounded-lg border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
            >
              {thaiMonths.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#617589] mb-1 block">ปี</label>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full text-sm rounded-lg border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
            >
              {[2023, 2024, 2025].map(y => (
                <option key={y} value={y}>{y + 543}</option>
              ))}
            </select>
          </div>
          <button 
            disabled={isGenerating}
            onClick={() => onGenerateSchedule(selectedMonth, selectedYear)}
            className="w-full bg-primary text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <span className="animate-spin material-symbols-outlined">sync</span>
            ) : (
              <span className="material-symbols-outlined">auto_awesome</span>
            )}
            จัดตารางเวร
          </button>
          <p className="text-[10px] text-center text-[#617589]">ระบบจะจัดเวรโดยคำนวณจากความพร้อมของบุคลากรและลำดับการวนเวร</p>
        </div>
      </div>
    </div>
  );
};

export default StaffSidebar;
