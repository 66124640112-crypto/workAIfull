
import React from 'react';
import { Staff, Shift, ShiftType } from '../types';

interface ScheduleGridProps {
  staffList: Staff[];
  shifts: Shift[];
  dates: Date[];
  onDeleteStaff: (id: string) => void;
  onEditStaff: (staff: Staff) => void;
  onCellClick: (staff: Staff, date: string) => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ 
  staffList, 
  shifts, 
  dates, 
  onDeleteStaff, 
  onEditStaff,
  onCellClick
}) => {
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getShiftForStaffDate = (staffId: string, dateStr: string) => {
    return shifts.find(s => s.staffId === staffId && s.date === dateStr);
  };

  const dayNames = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

  return (
    <div className="flex-1 overflow-auto bg-[#f0f2f4] dark:bg-[#0d131a] p-4">
      <div className="inline-block min-w-full bg-white dark:bg-[#111418] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800">
        {/* Grid Header */}
        <div className="flex divide-x divide-[#e5e7eb] dark:divide-gray-800 border-b border-[#e5e7eb] dark:border-gray-800 bg-[#f8fafc] dark:bg-gray-900 sticky top-0 z-10">
          <div className="w-[220px] p-3 flex items-center shrink-0 bg-[#f8fafc] dark:bg-gray-900 sticky left-0 z-20">
            <span className="text-xs font-bold text-[#617589] uppercase tracking-wider">ชื่อบุคลากร / จัดการ</span>
          </div>
          {dates.map((date, idx) => {
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            return (
              <div key={idx} className={`w-24 p-2 text-center shrink-0 ${isWeekend ? 'bg-orange-50/30 dark:bg-orange-900/10' : ''}`}>
                <p className="text-[10px] font-medium text-[#617589]">{dayNames[dayOfWeek]}</p>
                <p className="text-sm font-bold text-[#111418] dark:text-white">
                  {date.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Staff Rows */}
        <div className="divide-y divide-[#e5e7eb] dark:divide-gray-800">
          {staffList.map((staff) => (
            <div key={staff.id} className="flex divide-x divide-[#e5e7eb] dark:divide-gray-800 min-h-[70px]">
              {/* Sticky Name Col with Actions */}
              <div className="w-[220px] p-3 flex items-center gap-2 bg-white dark:bg-[#111418] sticky left-0 z-10 shrink-0 shadow-[2px_0_5px_rgba(0,0,0,0.05)] group">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-full size-8 shrink-0" 
                  style={{ backgroundImage: `url("${staff.avatar}")` }}
                ></div>
                <div className="overflow-hidden flex-1">
                  <p className="text-xs font-bold text-[#111418] dark:text-white truncate">{staff.name}</p>
                  <p className="text-[9px] text-[#617589] uppercase truncate">{staff.role}</p>
                </div>
                {/* Actions */}
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEditStaff(staff)}
                    className="size-6 flex items-center justify-center rounded bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <button 
                    onClick={() => onDeleteStaff(staff.id)}
                    className="size-6 flex items-center justify-center rounded bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Shift Cells */}
              {dates.map((date, idx) => {
                const dateStr = formatDate(date);
                const shift = getShiftForStaffDate(staff.id, dateStr);
                const isUnavailable = staff.unavailability?.includes(dateStr);

                return (
                  <div 
                    key={idx} 
                    onClick={() => onCellClick(staff, dateStr)}
                    className="w-24 p-1.5 shrink-0 flex flex-col justify-center relative group/cell hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    {isUnavailable && (
                      <div className="text-[9px] text-red-500 font-bold bg-red-50 dark:bg-red-900/20 p-1 rounded text-center border border-red-200">
                        แจ้งลาหยุด
                      </div>
                    )}
                    {!isUnavailable && shift && (
                      <div className={`w-full py-2 px-1 rounded border-l-2 flex flex-col items-center justify-center text-center shadow-sm
                        ${shift.type === ShiftType.DAY ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : 
                          shift.type === ShiftType.NIGHT ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500' : 
                          'bg-gray-50 border-gray-300'}`}>
                        <span className={`text-[10px] font-bold ${shift.type === ShiftType.DAY ? 'text-blue-700 dark:text-blue-400' : 'text-indigo-700 dark:text-indigo-400'}`}>
                          {shift.type}
                        </span>
                        <span className="text-[9px] text-[#617589]">{shift.startTime}</span>
                      </div>
                    )}
                    {!isUnavailable && !shift && (
                      <div className="opacity-0 group-hover/cell:opacity-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-300">add_circle</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          {staffList.length === 0 && (
            <div className="p-10 text-center text-[#617589] w-full">
              <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
              <p>ไม่มีรายชื่อบุคลากรในตารางนี้</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleGrid;
