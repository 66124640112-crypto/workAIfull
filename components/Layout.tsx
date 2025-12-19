
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  activeTab: 'schedule' | 'dashboard';
  onTabChange: (tab: 'schedule' | 'dashboard') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebar, activeTab, onTabChange }) => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e5e7eb] dark:border-gray-800 bg-white dark:bg-[#111418] px-6 z-20">
        <div className="flex items-center gap-4">
          <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
            <span className="material-symbols-outlined">local_hospital</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Thepsatri Hospital Scheduler</h2>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#617589] dark:text-gray-400">
            <button 
              onClick={() => onTabChange('schedule')}
              className={`${activeTab === 'schedule' ? 'text-primary' : 'hover:text-primary'} transition-colors font-bold flex items-center gap-1`}
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              ตารางเวร
            </button>
            <button 
              onClick={() => onTabChange('dashboard')}
              className={`${activeTab === 'dashboard' ? 'text-primary' : 'hover:text-primary'} transition-colors font-bold flex items-center gap-1`}
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              แดชบอร์ดสรุปผล
            </button>
          </nav>
          <div className="h-6 w-px bg-[#e5e7eb] dark:bg-gray-700 hidden md:block"></div>
          <div className="flex items-center gap-3">
            <button className="flex size-9 items-center justify-center rounded-full hover:bg-[#f0f2f4] dark:hover:bg-gray-800 transition-colors text-[#617589] dark:text-gray-400">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
            </button>
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full size-9 border border-[#e5e7eb] dark:border-gray-700 ml-2" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDUApqdC4FVWHU9FXdg-14_o2wa1ADuBjHv-5yFcsqBIkv_x38LbF4NYDiXfyhIH6EUJgqYYOFeSED8O3lQJufEFywrIHH-DZsNCXebghe-QiClxW7V314-NPfYEZxQ8Cp04E6db7WYi1BbIkKsno8PtxtrW5YcLLR3P5MTHWY6P7urudW7W12Sg1wv2hkjisk_Aec29BXoXuWIdb3HqhCT1sqKYP_kAZSInITb1rxmV9f10V6Xv5_lcuYS5ZjgkADJNzz_AVVnpe5W")' }}
            ></div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 flex flex-col border-r border-[#e5e7eb] dark:border-gray-800 bg-white dark:bg-[#111418] shrink-0 z-10">
          {sidebar}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#111418]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
