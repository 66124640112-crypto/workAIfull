
export enum ShiftType {
  DAY = 'เวรเช้า',
  NIGHT = 'เวรดึก',
  DOUBLE = 'ควบเวร',
  OFF = 'วันหยุด'
}

export enum RequestStatus {
  PENDING = 'รอดำเนินการ',
  APPROVED = 'อนุมัติแล้ว',
  DENIED = 'ปฏิเสธ'
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
  hoursWorked: number;
  maxHours: number;
  status: 'online' | 'away' | 'offline';
  unavailability?: string[]; // Array of ISO dates YYYY-MM-DD
}

export interface Shift {
  id: string;
  staffId: string;
  date: string; // ISO string YYYY-MM-DD
  type: ShiftType;
  startTime: string;
  endTime: string;
  zone: string;
  isOvertime?: boolean;
  isUnavailable?: boolean;
}

export interface SchedulingRequest {
  id: string;
  staffId: string;
  type: 'สลับเวร' | 'ลาหยุด';
  message: string;
  status: RequestStatus;
}
