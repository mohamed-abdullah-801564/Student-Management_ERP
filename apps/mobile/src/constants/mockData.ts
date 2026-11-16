export interface StudentItem {
  id: string;
  rollNo: string;
  name: string;
  initials: string;
  avatarBg?: string;
  status: 'P' | 'A' | 'L';
  badgeText?: string;
  badgeType?: 'bus' | 'medical' | 'unexcused' | 'parent' | 'late' | 'roll';
}

export const MOCK_STUDENTS: StudentItem[] = [
  {
    id: '1',
    rollNo: '#01',
    name: 'Aakash Raman',
    initials: 'AR',
    status: 'P',
    badgeText: 'On Time • Bus #4',
    badgeType: 'bus',
  },
  {
    id: '2',
    rollNo: '#02',
    name: 'Ananya Sri',
    initials: 'AS',
    status: 'A',
    badgeText: 'Medical Slip Submitted',
    badgeType: 'medical',
  },
  {
    id: '3',
    rollNo: '#03',
    name: 'Bhuvanesh K',
    initials: 'BK',
    status: 'P',
    badgeText: 'Roll: 8B03',
    badgeType: 'roll',
  },
  {
    id: '4',
    rollNo: '#04',
    name: 'Divya M',
    initials: 'DM',
    status: 'A',
    badgeText: '⚠️ Unexcused Absence',
    badgeType: 'unexcused',
  },
  {
    id: '5',
    rollNo: '#05',
    name: 'Faizan Ahmed',
    initials: 'FA',
    status: 'P',
    badgeText: 'Roll: 8B05',
    badgeType: 'roll',
  },
  {
    id: '6',
    rollNo: '#06',
    name: 'Harini Venkat',
    initials: 'HV',
    status: 'L',
    badgeText: '⏰ Arrived 08:45 AM',
    badgeType: 'late',
  },
  {
    id: '7',
    rollNo: '#07',
    name: 'Ishaan Verma',
    initials: 'IV',
    status: 'P',
    badgeText: 'Roll: 8B07',
    badgeType: 'roll',
  },
  {
    id: '8',
    rollNo: '#08',
    name: 'Karthik Raja',
    initials: 'KR',
    status: 'A',
    badgeText: '📱 Parent Notified via App',
    badgeType: 'parent',
  },
  {
    id: '9',
    rollNo: '#09',
    name: 'Lavanya R',
    initials: 'LR',
    status: 'P',
    badgeText: 'Roll: 8B09',
    badgeType: 'roll',
  },
  {
    id: '10',
    rollNo: '#10',
    name: 'Mohammed Zaid',
    initials: 'MZ',
    status: 'P',
    badgeText: 'Roll: 8B10',
    badgeType: 'roll',
  },
];

export interface SchedulePeriod {
  id: string;
  periodNo: number;
  timeRange: string;
  className: string;
  roomNo: string;
  subject: string;
  status: 'done' | 'current' | 'substitute' | 'upcoming';
  substituteNote?: string;
  substituteTeacher?: string;
  description?: string;
}

export const MOCK_SCHEDULE: SchedulePeriod[] = [
  {
    id: 'p1',
    periodNo: 1,
    timeRange: '08:30 - 09:15 AM',
    className: 'Grade 8-B',
    roomNo: 'Room 204',
    subject: 'Mathematics',
    status: 'done',
  },
  {
    id: 'p2',
    periodNo: 2,
    timeRange: '09:15 - 10:00 AM',
    className: 'Grade 7-C',
    roomNo: 'Room 102',
    subject: 'Mathematics',
    status: 'done',
  },
  {
    id: 'p3',
    periodNo: 3,
    timeRange: '10:15 - 11:00 AM',
    className: 'Grade 8-A',
    roomNo: 'Room 204',
    subject: 'Mathematics',
    status: 'current',
    description: 'Ch 4: Quadratic Equations — Ex 4.2',
  },
  {
    id: 'p4',
    periodNo: 4,
    timeRange: '11:00 AM',
    className: 'Grade 9-A',
    roomNo: 'Physics Lab 1',
    subject: 'Substitute Duty',
    status: 'substitute',
    substituteNote: 'Covering for Mr. Anand (Medical Leave)',
  },
  {
    id: 'p5',
    periodNo: 5,
    timeRange: '12:30 PM',
    className: 'Grade 8-B',
    roomNo: 'Room 204',
    subject: 'Problem Solving Clinic',
    status: 'upcoming',
  },
  {
    id: 'p6',
    periodNo: 6,
    timeRange: '01:15 PM',
    className: 'Class 8-B',
    roomNo: 'Room 204',
    subject: 'Form Tutor Hour',
    status: 'upcoming',
    description: 'Assembly & Diary Check',
  },
];

// ================= PARENT PORTAL MOCK DATA =================

export interface StudentChild {
  id: string;
  name: string;
  admissionNo: string;
  className: string;
  section: string;
  rollNo: string;
  overallAttendance: number;
  todayStatus: 'present' | 'absent' | 'leave';
  markedAt: string;
  inChargeName: string;
  avatarColor: string;
}

export const MOCK_CHILDREN: StudentChild[] = [
  {
    id: 'c1',
    name: 'Rahul Suresh',
    admissionNo: 'GW-2021-0842',
    className: 'Grade 8',
    section: 'B',
    rollNo: '12',
    overallAttendance: 94.2,
    todayStatus: 'present',
    markedAt: '08:42 AM',
    inChargeName: 'Mrs. Deepa R. (Mathematics)',
    avatarColor: '#4F46E5',
  },
  {
    id: 'c2',
    name: 'Priya Suresh',
    admissionNo: 'GW-2024-0319',
    className: 'Grade 4',
    section: 'A',
    rollNo: '07',
    overallAttendance: 97.8,
    todayStatus: 'present',
    markedAt: '08:35 AM',
    inChargeName: 'Mrs. Shanthi M. (Primary Head)',
    avatarColor: '#0EA5E9',
  },
];

export interface ParentPeriodDiary {
  id: string;
  periodNo: number;
  subject: string;
  timing: string;
  teacher: string;
  room: string;
  topicTaught: string;
}

export const MOCK_PARENT_DIARY: ParentPeriodDiary[] = [
  {
    id: 'd1',
    periodNo: 1,
    subject: 'Tamil Language',
    timing: '09:00 - 09:45 AM',
    teacher: 'Mrs. Revathi K.',
    room: 'Room 204',
    topicTaught: 'Kavithai - Mozhi Vaazhthu & Grammar roots',
  },
  {
    id: 'd2',
    periodNo: 2,
    subject: 'English Literature',
    timing: '09:50 - 10:35 AM',
    teacher: 'Mr. David Miller',
    room: 'Room 204',
    topicTaught: 'Julius Caesar Act 2 Scene 1 - Brutus Soliloquy',
  },
  {
    id: 'd3',
    periodNo: 3,
    subject: 'Mathematics',
    timing: '10:50 - 11:35 AM',
    teacher: 'Mrs. Deepa R.',
    room: 'Room 204',
    topicTaught: 'Quadratic Equations - Solving using factorization (Ex 4.2)',
  },
  {
    id: 'd4',
    periodNo: 4,
    subject: 'Science (Physics)',
    timing: '11:40 - 12:25 PM',
    teacher: 'Mr. Anand K.',
    room: 'Science Lab 2',
    topicTaught: 'Refraction of Light through glass slab & prism',
  },
];

export interface ParentHomeworkItem {
  id: string;
  subject: string;
  title: string;
  instructions: string;
  dueDate: string;
  isCompleted: boolean;
  hasAttachment: boolean;
  attachmentName?: string;
  teacherName: string;
  assignedDate: string;
}

export const MOCK_PARENT_HOMEWORK: ParentHomeworkItem[] = [
  {
    id: 'hw1',
    subject: 'Mathematics',
    title: 'Exercise 4.2 Questions 1 to 8',
    instructions: 'Complete questions 1 to 8 in fair homework notebook. Show full factorization steps.',
    dueDate: 'Tomorrow (Sep 14)',
    isCompleted: false,
    hasAttachment: true,
    attachmentName: 'blackboard_snap_ex4_2.jpg',
    teacherName: 'Mrs. Deepa R.',
    assignedDate: 'Sep 13',
  },
  {
    id: 'hw2',
    subject: 'Science',
    title: 'Lab Record Work - Human Eye',
    instructions: 'Draw neat labeled diagram of human eye and write functions of retina and cornea.',
    dueDate: 'Sep 15 (Fri)',
    isCompleted: true,
    hasAttachment: false,
    teacherName: 'Mr. Anand K.',
    assignedDate: 'Sep 12',
  },
  {
    id: 'hw3',
    subject: 'English',
    title: 'Character Sketch of Portia',
    instructions: 'Write 150 words character analysis in rough copy.',
    dueDate: 'Sep 16 (Sat)',
    isCompleted: false,
    hasAttachment: false,
    teacherName: 'Mr. David Miller',
    assignedDate: 'Sep 13',
  },
];

export interface ParentAssessmentReport {
  examName: string;
  term: string;
  academicYear: string;
  overallScore: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  classRank: number;
  totalStudents: number;
  inChargeRemark: string;
  inChargeName: string;
  subjectBreakdown: {
    subject: string;
    marksObtained: number;
    maxMarks: number;
    highestInClass: number;
    grade: string;
    remarks: string;
  }[];
}

export const MOCK_REPORT_CARD: ParentAssessmentReport = {
  examName: 'Term 1 Periodic Assessment',
  term: 'Mid-Term 1',
  academicYear: '2026-2027',
  overallScore: 462,
  totalMarks: 500,
  percentage: 92.4,
  grade: 'A1',
  classRank: 3,
  totalStudents: 42,
  inChargeRemark:
    'Rahul displays outstanding analytical thinking in Mathematics and Science. Regularly submits homework on time. Recommended to speak more frequently in English conversation activities.',
  inChargeName: 'Mrs. Deepa R. (Class In-Charge, Grade 8-B)',
  subjectBreakdown: [
    {
      subject: 'Mathematics',
      marksObtained: 96,
      maxMarks: 100,
      highestInClass: 98,
      grade: 'A1',
      remarks: 'Flawless quadratic proofs & geometry',
    },
    {
      subject: 'Science',
      marksObtained: 94,
      maxMarks: 100,
      highestInClass: 96,
      grade: 'A1',
      remarks: 'Excellent practical & lab diagrams',
    },
    {
      subject: 'Social Science',
      marksObtained: 91,
      maxMarks: 100,
      highestInClass: 95,
      grade: 'A1',
      remarks: 'Strong map reading & historical facts',
    },
    {
      subject: 'Tamil / 2nd Lang',
      marksObtained: 93,
      maxMarks: 100,
      highestInClass: 96,
      grade: 'A1',
      remarks: 'Rich vocabulary and poetic prose',
    },
    {
      subject: 'English',
      marksObtained: 88,
      maxMarks: 100,
      highestInClass: 93,
      grade: 'A2',
      remarks: 'Creative writing is very good; refine grammar syntax',
    },
  ],
};

export interface ChatMessage {
  id: string;
  sender: 'parent' | 'teacher';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'teacher',
    senderName: 'Mrs. Deepa R.',
    text: 'Good morning Mr. Suresh. Just wanted to remind you that the Science Exhibition project models must be submitted by Thursday.',
    timestamp: '09:15 AM',
    isRead: true,
  },
  {
    id: 'm2',
    sender: 'parent',
    senderName: 'Mr. Suresh',
    text: 'Good morning ma’am. Rahul has almost completed the hydraulic arm model. We will submit it on Wednesday itself.',
    timestamp: '09:22 AM',
    isRead: true,
  },
  {
    id: 'm3',
    sender: 'teacher',
    senderName: 'Mrs. Deepa R.',
    text: 'Wonderful! Also, congratulations on his Term 1 score — 3rd rank in the section! He has worked very diligently.',
    timestamp: '09:24 AM',
    isRead: true,
  },
];

