import type { StaffMember, Student, Course, AttendanceRecord, LibraryResource, LeaveRequest, ViewType, Assignment, Submission } from './types';
import { Role, Department, AttendanceStatus, ResourceType, LeaveType, LeaveRequestStatus, SubmissionStatus } from './types';

export const MOCK_STAFF_DATA: StaffMember[] = [
  {
    id: 'S001',
    name: 'Dr. Evelyn Reed',
    email: 'e.reed@school.edu',
    phone: '555-0101',
    department: Department.SCIENCE,
    position: 'Head of Science',
    role: Role.FACULTY,
    hireDate: '2018-08-15',
    status: 'Active',
  },
  {
    id: 'S002',
    name: 'Johnathan Carter',
    email: 'j.carter@school.edu',
    phone: '555-0102',
    department: Department.ADMINISTRATION,
    position: 'Principal',
    role: Role.ADMINISTRATOR,
    hireDate: '2015-03-20',
    status: 'Active',
  },
  {
    id: 'S003',
    name: 'Maria Garcia',
    email: 'm.garcia@school.edu',
    phone: '555-0103',
    department: Department.ARTS,
    position: 'Art Teacher',
    role: Role.FACULTY,
    hireDate: '2020-09-01',
    status: 'Active',
  },
  {
    id: 'S004',
    name: 'Samuel Chen',
    email: 's.chen@school.edu',
    phone: '555-0104',
    department: Department.MATHEMATICS,
    position: 'Math Teacher',
    role: Role.FACULTY,
    hireDate: '2019-08-22',
    status: 'On Leave',
  },
  {
    id: 'S005',
    name: 'Patricia Williams',
    email: 'p.williams@school.edu',
    phone: '555-0105',
    department: Department.ADMINISTRATION,
    position: 'HR Manager',
    role: Role.HR,
    hireDate: '2017-05-11',
    status: 'Active',
  },
  {
    id: 'S006',
    name: 'Michael Brown',
    email: 'm.brown@school.edu',
    phone: '555-0106',
    department: Department.PHYSICAL_EDUCATION,
    position: 'Gym Teacher',
    role: Role.FACULTY,
    hireDate: '2021-01-18',
    status: 'Active',
  },
  {
    id: 'S007',
    name: 'Linda Davis',
    email: 'l.davis@school.edu',
    phone: '555-0107',
    department: Department.SCIENCE,
    position: 'Biology Teacher',
    role: Role.FACULTY,
    hireDate: '2022-08-30',
    status: 'Active',
  },
  {
    id: 'S008',
    name: 'Robert Miller',
    email: 'r.miller@school.edu',
    phone: '555-0108',
    department: Department.ADMINISTRATION,
    position: 'Accountant',
    role: Role.HR,
    hireDate: '2016-11-01',
    status: 'Inactive',
  },
];

export let MOCK_COURSES: Course[] = [
    { id: 'C101', name: 'Introduction to Biology', department: Department.SCIENCE, teacherId: 'S001' },
    { id: 'C102', name: 'Calculus I', department: Department.MATHEMATICS, teacherId: 'S004' },
    { id: 'C103', name: 'World History', department: Department.ARTS, teacherId: 'S003' },
    { id: 'C104', name: 'English Literature', department: Department.ARTS, teacherId: 'S003' },
    { id: 'C105', name: 'Studio Art', department: Department.ARTS, teacherId: 'S003' },
    { id: 'C106', name: 'Advanced Chemistry', department: Department.SCIENCE, teacherId: 'S001' },
];

export let MOCK_STUDENT_DATA: Student[] = [
    {
        id: 'STU001',
        name: 'Alice Johnson',
        email: 'a.johnson@student.edu',
        enrollmentDate: '2023-09-01',
        status: 'Enrolled',
        courses: [MOCK_COURSES[0], MOCK_COURSES[1]],
    },
    {
        id: 'STU002',
        name: 'Bob Williams',
        email: 'b.williams@student.edu',
        enrollmentDate: '2022-09-01',
        status: 'Enrolled',
        courses: [MOCK_COURSES[2], MOCK_COURSES[3]],
    },
    {
        id: 'STU003',
        name: 'Charlie Brown',
        email: 'c.brown@student.edu',
        enrollmentDate: '2021-09-01',
        status: 'Graduated',
        courses: [],
    },
    {
        id: 'STU004',
        name: 'Diana Miller',
        email: 'd.miller@student.edu',
        enrollmentDate: '2023-09-01',
        status: 'Enrolled',
        courses: [MOCK_COURSES[4], MOCK_COURSES[1], MOCK_COURSES[0]],
    },
    {
        id: 'STU005',
        name: 'Ethan Davis',
        email: 'e.davis@student.edu',
        enrollmentDate: '2022-09-01',
        status: 'Withdrawn',
        courses: [],
    },
];

const today = new Date();
const todayString = today.toISOString().split('T')[0];
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterdayString = yesterday.toISOString().split('T')[0];

export const MOCK_ATTENDANCE_DATA: AttendanceRecord[] = [
  // Today's Data
  { id: 'ATT001', studentId: 'STU001', courseId: 'C101', date: todayString, status: AttendanceStatus.PRESENT },
  { id: 'ATT002', studentId: 'STU001', courseId: 'C102', date: todayString, status: AttendanceStatus.PRESENT },
  { id: 'ATT003', studentId: 'STU002', courseId: 'C103', date: todayString, status: AttendanceStatus.ABSENT },
  { id: 'ATT004', studentId: 'STU002', courseId: 'C104', date: todayString, status: AttendanceStatus.PRESENT },
  { id: 'ATT005', studentId: 'STU004', courseId: 'C105', date: todayString, status: AttendanceStatus.LATE },
  { id: 'ATT006', studentId: 'STU004', courseId: 'C102', date: todayString, status: AttendanceStatus.PRESENT },
  { id: 'ATT013', studentId: 'STU004', courseId: 'C101', date: todayString, status: AttendanceStatus.PRESENT },


  // Yesterday's Data
  { id: 'ATT007', studentId: 'STU001', courseId: 'C101', date: yesterdayString, status: AttendanceStatus.PRESENT },
  { id: 'ATT008', studentId: 'STU001', courseId: 'C102', date: yesterdayString, status: AttendanceStatus.LATE },
  { id: 'ATT009', studentId: 'STU002', courseId: 'C103', date: yesterdayString, status: AttendanceStatus.PRESENT },
  { id: 'ATT010', studentId: 'STU002', courseId: 'C104', date: yesterdayString, status: AttendanceStatus.PRESENT },
  { id: 'ATT011', studentId: 'STU004', courseId: 'C105', date: yesterdayString, status: AttendanceStatus.ABSENT },
  { id: 'ATT012', studentId: 'STU004', courseId: 'C102', date: yesterdayString, status: AttendanceStatus.PRESENT },
  { id: 'ATT014', studentId: 'STU004', courseId: 'C101', date: yesterdayString, status: AttendanceStatus.ABSENT },

];

export let MOCK_E_LIBRARY_DATA: LibraryResource[] = [
  { id: 'LIB001', title: 'The Principles of Quantum Mechanics', author: 'P. A. M. Dirac', type: ResourceType.BOOK, coverImage: 'https://picsum.photos/seed/quantum/400/600', publicationYear: 1930, department: Department.SCIENCE, description: 'A foundational text on quantum mechanics, offering a rigorous mathematical framework for the subject. Essential reading for physics students and researchers.', isAvailable: true },
  { id: 'LIB002', title: 'A Brief History of Time', author: 'Stephen Hawking', type: ResourceType.BOOK, coverImage: 'https://picsum.photos/seed/time/400/600', publicationYear: 1988, department: Department.SCIENCE, description: 'A landmark book in popular science, explaining complex cosmological concepts from the Big Bang to black holes in accessible terms for the general reader.', isAvailable: false, borrowedBy: 'STU001' },
  { id: 'LIB003', title: 'The Structure of Scientific Revolutions', author: 'Thomas S. Kuhn', type: ResourceType.JOURNAL, coverImage: 'https://picsum.photos/seed/revolutions/400/600', publicationYear: 1962, department: Department.SCIENCE, description: "An influential analysis of the history of science. Kuhn's concept of 'paradigm shifts' has had a profound impact on how we understand scientific progress.", isAvailable: true },
  { id: 'LIB004', title: 'Pride and Prejudice', author: 'Jane Austen', type: ResourceType.BOOK, coverImage: 'https://picsum.photos/seed/pride/400/600', publicationYear: 1813, department: Department.ARTS, description: 'A classic novel of manners, exploring themes of love, class, and social expectations in early 19th-century England through the witty and independent heroine, Elizabeth Bennet.', isAvailable: true },
  { id: 'LIB005', title: 'To the Lighthouse', author: 'Virginia Woolf', type: ResourceType.BOOK, coverImage: 'https://picsum.photos/seed/lighthouse/400/600', publicationYear: 1927, department: Department.ARTS, description: 'A seminal work of modernist fiction, utilizing stream-of-consciousness to explore the inner lives of its characters during a visit to the Isle of Skye.', isAvailable: false, borrowedBy: 'STU004' },
  { id: 'LIB006', title: 'Calculus: A New Horizon', author: 'Howard Anton', type: ResourceType.BOOK, coverImage: 'https://picsum.photos/seed/calculus/400/600', publicationYear: 1999, department: Department.MATHEMATICS, description: 'A comprehensive and widely used textbook that covers the fundamentals of calculus, from limits and derivatives to integrals and series.', isAvailable: true },
  { id: 'LIB007', title: 'Journal of the American Mathematical Society', author: 'Various', type: ResourceType.JOURNAL, coverImage: 'https://picsum.photos/seed/jams/400/600', publicationYear: 2023, department: Department.MATHEMATICS, description: 'A prestigious academic journal publishing cutting-edge research across all fields of pure and applied mathematics.', isAvailable: true },
  { id: 'LIB008', title: 'The Art of War', author: 'Sun Tzu', type: ResourceType.BOOK, coverImage: 'https://picsum.photos/seed/war/400/600', publicationYear: -500, department: Department.ARTS, description: 'An ancient Chinese military treatise attributed to Sun Tzu. Its timeless principles of strategy and tactics are studied worldwide in military, business, and legal contexts.', isAvailable: true },
  { id: 'LIB009', title: 'The Elements of Style', author: 'Strunk & White', type: ResourceType.BOOK, coverImage: 'https://picsum.photos/seed/style/400/600', publicationYear: 1918, department: Department.ARTS, description: 'A classic American English writing style guide. It advocates for clarity, brevity, and the active voice, becoming an essential tool for writers of all kinds.', isAvailable: true },
  { id: 'LIB010', title: 'Physical Education and Sport', author: 'Various', type: ResourceType.JOURNAL, coverImage: 'https://picsum.photos/seed/sport/400/600', publicationYear: 2022, department: Department.PHYSICAL_EDUCATION, description: 'A peer-reviewed journal presenting original research and reviews in the fields of sports science, physical education, and kinesiology.', isAvailable: true },
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 'LR001', staffId: 'S001', staffName: 'Dr. Evelyn Reed', leaveType: LeaveType.ANNUAL, startDate: '2024-08-01', endDate: '2024-08-10', reason: 'Family vacation.', status: LeaveRequestStatus.APPROVED, requestDate: '2024-06-15' },
  { id: 'LR002', staffId: 'S003', staffName: 'Maria Garcia', leaveType: LeaveType.SICK, startDate: '2024-07-22', endDate: '2024-07-23', reason: 'Flu symptoms.', status: LeaveRequestStatus.APPROVED, requestDate: '2024-07-22' },
  { id: 'LR003', staffId: 'S006', staffName: 'Michael Brown', leaveType: LeaveType.SPECIAL, startDate: '2024-09-05', endDate: '2024-09-06', reason: 'Attending a conference.', status: LeaveRequestStatus.PENDING, requestDate: '2024-07-20' },
  { id: 'LR004', staffId: 'S007', staffName: 'Linda Davis', leaveType: LeaveType.ANNUAL, startDate: '2024-12-20', endDate: '2025-01-05', reason: 'Holiday travel.', status: LeaveRequestStatus.PENDING, requestDate: '2024-07-18' },
  { id: 'LR005', staffId: 'S001', staffName: 'Dr. Evelyn Reed', leaveType: LeaveType.MISSION, startDate: '2024-07-25', endDate: '2024-07-28', reason: 'Field trip supervision.', status: LeaveRequestStatus.REJECTED, requestDate: '2024-07-10' },
];

export let MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 'AS001', courseId: 'C101', title: 'Biology Lab Report 1', description: 'Complete a report on the cell mitosis observation.', dueDate: '2024-08-15' },
  { id: 'AS002', courseId: 'C101', title: 'Photosynthesis Essay', description: 'Write a 1000-word essay on the importance of photosynthesis.', dueDate: '2024-09-01' },
  { id: 'AS003', courseId: 'C102', title: 'Calculus Problem Set 1', description: 'Solve problems 1-20 from Chapter 1.', dueDate: '2024-08-20' },
  { id: 'AS004', courseId: 'C104', title: 'Shakespeare Analysis', description: 'Analyze the "To be or not to be" soliloquy from Hamlet.', dueDate: '2024-08-25' },
];

export let MOCK_SUBMISSIONS: Submission[] = [
  // Alice Johnson (STU001)
  { id: 'SUB001', assignmentId: 'AS001', studentId: 'STU001', submissionDate: '2024-08-14', status: SubmissionStatus.GRADED, grade: 92 },
  { id: 'SUB002', assignmentId: 'AS002', studentId: 'STU001', submissionDate: null, status: SubmissionStatus.PENDING, grade: null },
  { id: 'SUB003', assignmentId: 'AS003', studentId: 'STU001', submissionDate: '2024-08-21', status: SubmissionStatus.LATE, grade: 70 },

  // Bob Williams (STU002)
  { id: 'SUB004', assignmentId: 'AS004', studentId: 'STU002', submissionDate: '2024-08-24', status: SubmissionStatus.SUBMITTED, grade: null },
  
  // Diana Miller (STU004)
  { id: 'SUB005', assignmentId: 'AS001', studentId: 'STU004', submissionDate: '2024-08-15', status: SubmissionStatus.GRADED, grade: 88 },
  { id: 'SUB006', assignmentId: 'AS003', studentId: 'STU004', submissionDate: null, status: SubmissionStatus.PENDING, grade: null },
];

export const ROLE_NAV_ITEMS: Record<Role, ViewType[]> = {
  [Role.ADMINISTRATOR]: ['Dashboard', 'Staff', 'Students', 'Courses', 'E-Library', 'Attendance', 'Leave', 'Reports'],
  [Role.HR]: ['Dashboard', 'Staff', 'Attendance', 'Leave', 'Reports'],
  [Role.FACULTY]: ['Dashboard', 'Students', 'Courses', 'Assignments', 'Course Analytics', 'Student Performance', 'E-Library', 'Attendance', 'Leave', 'Scan QR'],
  [Role.STUDENT]: ['Dashboard', 'Courses', 'Assignments', 'E-Library', 'Attendance', 'Scan QR'],
};

// Simple Event Emitter for cross-component communication
class EventEmitter {
  private events: Record<string, Function[]> = {};

  dispatch<T>(event: string, data?: T): void {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }

  subscribe<T>(event: string, callback: (data: T) => void): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  unsubscribe<T>(event: string, callback: (data: T) => void): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }
}

export const eventEmitter = new EventEmitter();

export interface StudentCheckInPayload {
    student: Student;
    course: Course;
}
