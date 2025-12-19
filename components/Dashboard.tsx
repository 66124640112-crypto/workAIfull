
import React from 'react';
import { Staff, Shift, ShiftType } from '../types';

interface DashboardProps {
  staffList: Staff[];
  shifts: Shift[];
}

const Dashboard: React.FC<DashboardProps> = ({ staffList, shifts }) => {
  const totalShifts = shifts.length;
  const dayShifts = shifts.filter(s => s.type === ShiftType.DAY).length;
  const nightShifts = shifts.filter(s => s.type === ShiftType.NIGHT).length;
  
  const totalLeaves = staffList.reduce((acc, s) => acc + (s.unavailability?.length || 0), 0);
  
  const onlineStaff = staffList.filter(s => s.status === 'online').length;
  const awayStaff = staffList.filter(s => s.status === 'away').length;
  const offlineStaff = staffList.filter(s => s.status === 'offline').length;

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-[#0d131a] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-[#111418] dark:text-white">ภาพรวมการบริหารเวรเดือนนี้</h2>
          <p className="text-[#617589]">ข้อมูลวิเคราะห์เชิงลึกและสถิติการทำงานของบุคลากรในวอร์ด</p>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#617589]">บุคลากรทั้งหมด</p>
                <p className="text-2xl font-bold">{staffList.length} ราย</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined">assignment_turned_in</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#617589]">เวรที่จัดแล้ว</p>
                <p className="text-2xl font-bold">{totalShifts} เวร</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <span className="material-symbols-outlined">event_busy</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#617589]">วันลาสะสม</p>
                <p className="text-2xl font-bold">{totalLeaves} วัน</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined">timer</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#617589]">เฉลี่ยชั่วโมง/คน</p>
                <p className="text-2xl font-bold">
                  {staffList.length ? (shifts.length * 12 / staffList.length).toFixed(1) : 0} ชม.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workload Section */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              ภาระงานรายบุคคล (รายชั่วโมง)
            </h3>
            <div className="space-y-6">
              {staffList.map(s => {
                const hours = shifts.filter(sh => sh.staffId === s.id).length * 12;
                const percentage = Math.min((hours / s.maxHours) * 100, 100);
                const isOver = hours > s.maxHours;
                return (
                  <div key={s.id}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold">{s.name} ({s.role.split(' ')[0]})</span>
                      <span className={`text-xs font-bold ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
                        {hours}/{s.maxHours} ชม.
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : 'bg-primary'}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shift Analysis Section */}
          <div className="flex flex-col gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex-1">
              <h3 className="font-bold text-lg mb-6">สัดส่วนประเภทเวร</h3>
              <div className="flex items-center gap-8">
                <div className="relative size-32">
                  <svg className="size-full" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200 dark:text-gray-800 stroke-current"
                      strokeWidth="3.8"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary stroke-current"
                      strokeWidth="3.8"
                      strokeDasharray={`${(dayShifts / (totalShifts || 1)) * 100}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-bold">{totalShifts}</span>
                    <span className="text-[10px] text-gray-500">รวมเวร</span>
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-full bg-primary"></span>
                      <span className="text-sm font-medium">เวรเช้า</span>
                    </div>
                    <span className="text-sm font-bold">{dayShifts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-full bg-gray-200 dark:bg-gray-800"></span>
                      <span className="text-sm font-medium">เวรดึก</span>
                    </div>
                    <span className="text-sm font-bold">{nightShifts}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex-1">
              <h3 className="font-bold text-lg mb-6">สถานะทีมแบบเรียลไทม์</h3>
              <div className="flex justify-between items-center px-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="size-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold">{onlineStaff}</span>
                  <span className="text-[10px] text-gray-500 uppercase">ออนไลน์</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="size-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-bold">{awayStaff}</span>
                  <span className="text-[10px] text-gray-500 uppercase">พักผ่อน</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="size-3 rounded-full bg-gray-400"></div>
                  <span className="text-xs font-bold">{offlineStaff}</span>
                  <span className="text-[10px] text-gray-500 uppercase">ออกเวร</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
