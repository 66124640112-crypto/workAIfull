
import { Staff, Shift, ShiftType, SchedulingRequest, RequestStatus } from './types';

export const MOCK_STAFF: Staff[] = [
  {
    id: '1',
    name: 'มะลิ ศรีวัฒน์',
    role: 'พยาบาลวิชาชีพ (RN)',
    specialty: 'ผู้เชี่ยวชาญ ICU',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD39ozcRfgrTUffcYz-fGCThyvgLmArGea6UpfYyFFH_BQAqLavbm8dwyeheEg2J98baEenUILGgKrlINZjkiOURMkNgsBDd46g4vR7XL4dOKofy957h4sWt1E5FZlyBSXFSvMYUhyDfsQ1zcDVGCQ0Ek2oQ1ue2Ryc1Xy7cCuN5GN96EVQwIeCpmCh3JLU3Lkp7XupdSlcbfI0MZqy9i8zd709UZybwWmPT8S7cz5AZK4z0nJ9tfwPJlqJ1SnDL6NpmS7BeQtbI4f0',
    hoursWorked: 36,
    maxHours: 40,
    status: 'online',
    unavailability: ['2023-10-15', '2023-10-20']
  },
  {
    id: '2',
    name: 'สมชาย ใจดี',
    role: 'พยาบาลเทคนิค (LPN)',
    specialty: 'แผนกทั่วไป',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCstNK5czvvNhP1yI8QjG3bw-w6FJHWXJJY47e3RZWBXpuZWB9vfbuZc0bMZQfk4_hNGz_xcXabq147JJbiQYkBqWAvyplsd2qODVWxxvIZkWLUXUuMV_L_1NireLZDncvCjw5GMyAKmw_oEJ7XH8M3DSoPhJvjSKOYEmgGXqAbgiOy6otGhduvoyFGocKoXGdC0RzXh5yLIJcBz2skYFlcohYx8tG1T1MZ-vEA6lgTQCy9CQnwmbuyMZSsVcsmdB1GRI0G205kuBQy',
    hoursWorked: 24,
    maxHours: 40,
    status: 'away',
    unavailability: ['2023-10-12', '2023-10-13']
  },
  {
    id: '3',
    name: 'ศิริพร ลี',
    role: 'พยาบาลวิชาชีพ (RN)',
    specialty: 'พยาบาลอาวุโส',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIjL3bMiIGqRBF_pUM_jOvdDB38vkGzBeztc8VgdHFM5r8K3zlNi-OTvwfsYGOSKqv0YGBuoOwzqh8c6os6MyozYXIQkQCywPRVi3etLIt8mh5PaBXtvvbJB9x_CREeW8I5kk9WScFXl8Iq2kCJ3mFJQuuqEHbK8dIosMxHd9V8IXZSCWuDVxVPmGUmDikpKVGUTFrds1FgZ8noRdZ8_Dv5ay3BmEvXowXZayx0CPyZBNwkJl4Ihmg5i5O2-ioBFVzNT-imgEmtgHY',
    hoursWorked: 42,
    maxHours: 40,
    status: 'online',
    unavailability: ['2023-10-14']
  },
  {
    id: '4',
    name: 'พลอย นพรัตน์',
    role: 'ผู้ช่วยพยาบาล (NA)',
    specialty: 'ฝึกหัด',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsShqLgFZDU-er5M9ciLbeIehspzou4xg2SuRPxs3HpkMZ1s3tCeAo4ABwOvxebQc0nIJlp50B7Xe_BJg9tLzdi7X_l-F4y9otw5MTqYELmNkUrtW_8Q_Alm7rQrk9qKeb6WhfiCZwBRV28RcgcoxYH2D7sf7g-C_qfHNO2iMn-WEsJuabea-gWnq1hFnQ3FLxN9xcIlvE5OYgW0lWDRxgoKYKUMg61HoYphJnBQCt1UU8aK2Vus-7CgMxtyhhd6rHbTHR3qrB112C',
    hoursWorked: 0,
    maxHours: 40,
    status: 'offline',
    unavailability: []
  }
];

export const MOCK_SHIFTS: Shift[] = []; // Start empty for demonstration of auto-scheduling

export const MOCK_REQUESTS: SchedulingRequest[] = [
  {
    id: 'r1',
    staffId: '4',
    type: 'สลับเวร',
    message: 'พลอย น. ต้องการสลับเวรกับ มะลิ ศ.',
    status: RequestStatus.PENDING
  }
];
