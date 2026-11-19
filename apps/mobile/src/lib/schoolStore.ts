import { MOCK_PARENT_HOMEWORK, ParentHomeworkItem, MOCK_CHAT_MESSAGES, ChatMessage } from '../constants/mockData';

export interface SchoolCircular {
  id: string;
  memoNo: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'parents' | 'teachers';
  priority: 'normal' | 'urgent';
  date: string;
  author: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface StudentLeaveRequest {
  id: string;
  studentName: string;
  className: string;
  parentName: string;
  reason: string;
  startDate: string;
  endDate: string;
  medicalNoteUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

const INITIAL_CIRCULARS: SchoolCircular[] = [
  {
    id: 'cir-1',
    memoNo: 'CIR-2026-NOV-088',
    title: 'Annual Athletic Meet & Sports Day 2026 Schedule',
    content:
      'Dear Parents, Guardians and Faculty, We are delighted to announce our Annual Athletic Meet & Sports Day 2026 scheduled for Friday, 28th November at the Senior Campus Athletics Ground. Students must report in House Uniforms by 07:30 AM sharp.',
    targetAudience: 'all',
    priority: 'normal',
    date: '16 Nov 2026',
    author: 'Dr. K. Arumugam, Principal',
    attachmentUrl:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    attachmentName: 'Sports_Day_Schedule_Map.jpg',
  },
  {
    id: 'cir-2',
    memoNo: 'CIR-2026-NOV-082',
    title: 'CBSE Pre-Board & Term 1 Evaluation Guidelines',
    content:
      'Faculty moderation meeting scheduled for 3:30 PM in AV Room 2. Subject teachers must finalize Term 1 practical assessments by Friday.',
    targetAudience: 'teachers',
    priority: 'normal',
    date: '14 Nov 2026',
    author: 'Academic Council',
  },
  {
    id: 'cir-3',
    memoNo: 'CIR-2026-NOV-079',
    title: 'Advisory: Winter Uniform & Morning Timings',
    content:
      'All students are requested to wear full winter blazers / cardigans from Monday. Morning roll call assembly timings adjusted to 8:45 AM due to seasonal morning fog.',
    targetAudience: 'parents',
    priority: 'urgent',
    date: '12 Nov 2026',
    author: 'Principal Office',
    attachmentUrl:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    attachmentName: 'Winter_Uniform_Advisory.jpg',
  },
];

const INITIAL_LEAVE_REQUESTS: StudentLeaveRequest[] = [
  {
    id: 'leave-1',
    studentName: 'Rahul Suresh',
    className: 'Class 8-B',
    parentName: 'Mr. Suresh Ramanathan',
    reason: 'Mild viral fever & headache. Physician advised 1 day bed rest.',
    startDate: '16 Nov 2026',
    endDate: '16 Nov 2026',
    status: 'pending',
    requestedAt: '08:15 AM Today',
  },
];

export interface SubstitutionRecord {
  id: string;
  period: string;
  timeSlot: string;
  gradeSection: string;
  subject: string;
  room: string;
  absentFaculty: string;
  leaveReason: string;
  assignedFaculty: string | null;
  assignedAt: string | null;
  status: 'pending' | 'allocated';
}

export interface BlackboardSnapshot {
  id: string;
  title: string;
  subject: string;
  grade: string;
  date: string;
  period: string;
  teacher: string;
  imageUrl?: string;
  notes: string[];
  keyFormulas?: string[];
}

const INITIAL_SUBSTITUTIONS: SubstitutionRecord[] = [
  {
    id: 'sub-p3',
    period: 'Period 3',
    timeSlot: '10:15 – 11:00 AM',
    gradeSection: 'Grade 9-B',
    subject: 'Physics / General Science',
    room: 'Room 302',
    absentFaculty: 'Mr. Rajesh S.',
    leaveReason: 'Medical Leave (Emergency Approval)',
    assignedFaculty: null,
    assignedAt: null,
    status: 'pending',
  },
  {
    id: 'sub-p5',
    period: 'Period 5',
    timeSlot: '12:30 – 01:15 PM',
    gradeSection: 'Grade 10-A',
    subject: 'English Literature',
    room: 'Room 204',
    absentFaculty: 'Mrs. Kavitha Nair',
    leaveReason: 'Casual Leave (Pre-scheduled)',
    assignedFaculty: null,
    assignedAt: null,
    status: 'pending',
  },
  {
    id: 'sub-p1',
    period: 'Period 1',
    timeSlot: '08:30 – 09:15 AM',
    gradeSection: 'Grade 8-A',
    subject: 'Mathematics',
    room: 'Room 101',
    absentFaculty: 'Mr. Rajesh S.',
    leaveReason: 'Medical Leave',
    assignedFaculty: 'Mrs. Deepa R.',
    assignedAt: '08:15 AM Today',
    status: 'allocated',
  },
  {
    id: 'sub-p2',
    period: 'Period 2',
    timeSlot: '09:20 – 10:05 AM',
    gradeSection: 'Grade 10-C',
    subject: 'English Prose',
    room: 'Room 206',
    absentFaculty: 'Mrs. Kavitha Nair',
    leaveReason: 'Casual Leave',
    assignedFaculty: 'Mr. Anand Verma',
    assignedAt: '08:45 AM Today',
    status: 'allocated',
  },
];

export const BLACKBOARD_SAMPLES: Record<string, BlackboardSnapshot> = {
  math_quadratic: {
    id: 'math_quadratic',
    title: 'Chapter 4: Quadratic Equations & Discriminant Criteria',
    subject: 'Mathematics',
    grade: 'Class 8-B',
    date: 'Today • Period 2',
    period: 'Period 2 (09:20 AM)',
    teacher: 'Mrs. Deepa R.',
    notes: [
      'Standard Form: ax² + bx + c = 0 (where a ≠ 0)',
      'Quadratic Formula: x = [-b ± √(b² - 4ac)] / 2a',
      'Discriminant D = b² - 4ac:',
      '  • Case 1: If D > 0 → Two distinct real roots',
      '  • Case 2: If D = 0 → Two equal real roots (x = -b / 2a)',
      '  • Case 3: If D < 0 → No real roots (imaginary)',
      'HW Due Tomorrow: Practice Set 4.2 Questions 1 to 6.',
    ],
    keyFormulas: [
      'ax² + bx + c = 0',
      'D = b² - 4ac',
      'x = (-b ± √D) / 2a',
    ],
  },
  science_optics: {
    id: 'science_optics',
    title: 'Chapter 6: Light & Concave Mirror Ray Tracing',
    subject: 'Science',
    grade: 'Class 8-B',
    date: 'Today • Period 3',
    period: 'Period 3 (10:15 AM)',
    teacher: 'Mr. Anand K.',
    notes: [
      'Principal Focus (F) and Center of Curvature (C = 2F)',
      'Mirror Formula: 1/f = 1/v + 1/u',
      'Magnification: m = -v/u = h\'/h',
      'Ray 1: Parallel to principal axis reflects through Focus (F)',
      'Ray 2: Passing through Center of Curvature reflects back along same path',
      'Object between C & F produces Real, Inverted and Magnified image beyond C.',
    ],
    keyFormulas: [
      '1/f = 1/v + 1/u',
      'm = -v/u',
      'R = 2f',
    ],
  },
};

type Listener = () => void;

class SchoolStore {
  private homework: ParentHomeworkItem[] = [...MOCK_PARENT_HOMEWORK];
  private substitutions: SubstitutionRecord[] = [...INITIAL_SUBSTITUTIONS];
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  getHomework(): ParentHomeworkItem[] {
    return this.homework;
  }

  getSubstitutions(): SubstitutionRecord[] {
    return this.substitutions;
  }

  addHomework(item: ParentHomeworkItem) {
    this.homework = [item, ...this.homework];
    this.notify();
  }

  toggleHomework(id: string) {
    this.homework = this.homework.map((hw) =>
      hw.id === id ? { ...hw, isCompleted: !hw.isCompleted } : hw
    );
    this.notify();
  }

  private facultyPhotoUri: string | null = null;
  private studentMarks: Record<string, number> = {
    '1': 88, // Aakash Raman
    '2': 94, // Ananya Sri
    '3': 98, // Bhuvanesh K
    '4': 32, // Dinesh Kumar
    '5': 76, // Faizan Ahmed
    '6': 85, // Harini Venkat
    'rahul': 96, // Rahul Suresh
  };

  getFacultyPhoto(): string | null {
    return this.facultyPhotoUri;
  }

  setFacultyPhoto(uri: string) {
    this.facultyPhotoUri = uri;
    this.notify();
  }

  getStudentMarks(): Record<string, number> {
    return this.studentMarks;
  }

  setStudentMark(studentId: string, mark: number) {
    this.studentMarks = {
      ...this.studentMarks,
      [studentId]: mark,
    };
    this.notify();
  }

  private circulars: SchoolCircular[] = [...INITIAL_CIRCULARS];
  private chatMessages: ChatMessage[] = [...MOCK_CHAT_MESSAGES];
  private leaveRequests: StudentLeaveRequest[] = [...INITIAL_LEAVE_REQUESTS];

  getCirculars(audience?: 'parents' | 'teachers'): SchoolCircular[] {
    if (!audience) return this.circulars;
    return this.circulars.filter(
      (c) => c.targetAudience === 'all' || c.targetAudience === audience
    );
  }

  addCircular(circular: SchoolCircular) {
    this.circulars = [circular, ...this.circulars];
    this.notify();
  }

  getChatMessages(): ChatMessage[] {
    return this.chatMessages;
  }

  addChatMessage(msg: ChatMessage) {
    this.chatMessages = [...this.chatMessages, msg];
    this.notify();
  }

  getLeaveRequests(): StudentLeaveRequest[] {
    return this.leaveRequests;
  }

  addLeaveRequest(req: StudentLeaveRequest) {
    this.leaveRequests = [req, ...this.leaveRequests];
    // Also add to chat as a formal notification
    const chatMsg: ChatMessage = {
      id: `m_leave_${Date.now()}`,
      sender: 'parent',
      senderName: req.parentName,
      text: `Formal Leave Request Submitted for ${req.studentName} (${req.className}). Reason: ${req.reason}. Requested Date: ${req.startDate}.`,
      timestamp: 'Just now',
      isRead: true,
    };
    this.chatMessages = [...this.chatMessages, chatMsg];
    this.notify();
  }

  approveLeaveRequest(id: string) {
    this.leaveRequests = this.leaveRequests.map((r) =>
      r.id === id ? { ...r, status: 'approved' as const } : r
    );
    // Add teacher confirmation to chat
    const teacherMsg: ChatMessage = {
      id: `m_apprv_${Date.now()}`,
      sender: 'teacher',
      senderName: 'Mrs. Deepa R.',
      text: 'Leave Request Approved ✓. Student attendance record updated with Excused Leave slip.',
      timestamp: 'Just now',
      isRead: true,
    };
    this.chatMessages = [...this.chatMessages, teacherMsg];
    this.notify();
  }

  assignSubstitute(recordId: string, facultyName: string) {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.substitutions = this.substitutions.map((sub) =>
      sub.id === recordId
        ? {
            ...sub,
            assignedFaculty: facultyName,
            assignedAt: `${now} Today`,
            status: 'allocated',
          }
        : sub
    );
    this.notify();
  }
}

export const schoolStore = new SchoolStore();
