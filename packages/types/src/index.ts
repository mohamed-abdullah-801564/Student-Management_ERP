export type UserRole = 'principal' | 'coordinator' | 'incharge' | 'teacher' | 'parent';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email?: string;
  avatarUrl?: string;
  staffId?: string;
  subject?: string;
  assignedClass?: string; // e.g. "8-B" for In-charge
}

export type AttendanceStatus = 'P' | 'A' | 'L'; // Present, Absent, Late

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  avatar?: string;
  initials: string;
  class: string;
  section: string;
  busInfo?: string; // e.g. "On Time • Bus #4"
  medicalSlipNote?: string;
  attendanceStatus?: AttendanceStatus;
  note?: string;
}

export interface TimetablePeriod {
  periodNo: number;
  startTime: string;
  endTime: string;
  className: string;
  section: string;
  subject: string;
  roomNo: string;
  teacherName: string;
  isCurrent?: boolean;
  isCompleted?: boolean;
  isSubstitute?: boolean;
  substituteNote?: string;
  substituteFor?: string;
  todayTopic?: string;
  topicProgress?: string; // e.g. "Step 2 of 4"
}

export interface AttendanceSummary {
  date: string;
  session: 'morning' | 'afternoon';
  className: string;
  section: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  isSubmitted: boolean;
  submittedAt?: string;
}

export interface HomeworkItem {
  id: string;
  className: string;
  section: string;
  subject: string;
  title: string;
  description?: string;
  blackboardPhotoUrl?: string;
  assignedDate: string;
  dueDate: string;
  allowParentDone: boolean;
  isCompletedByParent?: boolean;
  status: 'active' | 'completed' | 'overdue';
}

export interface SubstituteCandidate {
  id: string;
  name: string;
  initials: string;
  subject: string;
  avatarUrl?: string;
  currentWorkload: string; // e.g. "2/6 periods today"
  isRecommended?: boolean;
}
