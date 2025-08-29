import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import queryClient from './lib/queryClient';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import StudentForm from './pages/StudentForm';
import Teachers from './pages/Teachers';
import TeacherDetail from './pages/TeacherDetail';
import TeacherForm from './pages/TeacherForm';
import Classes from './pages/Classes';
import ClassDetail from './pages/ClassDetail';
import ClassForm from './pages/ClassForm';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail';
import SubjectForm from './pages/SubjectForm';
import Timetable from './pages/Timetable';
import TimetableDetail from './pages/TimetableDetail';
import TimetableForm from './pages/TimetableForm';
import Attendance from './pages/Attendance';
import AttendanceForm from './pages/AttendanceForm';
import Grades from './pages/Grades';
import GradesForm from './pages/GradesForm';
import ReportCard from './pages/ReportCard';
import Announcements from './pages/Announcements';
import AnnouncementsForm from './pages/AnnouncementsForm';
import FileUpload from './pages/FileUpload';
import Files from './pages/Files';
import AuditLogs from './pages/AuditLogs';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/:id/edit" element={<StudentForm />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/:id" element={<TeacherDetail />} />
          <Route path="/teachers/new" element={<TeacherForm />} />
          <Route path="/teachers/:id/edit" element={<TeacherForm />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/:id" element={<ClassDetail />} />
          <Route path="/classes/new" element={<ClassForm />} />
          <Route path="/classes/:id/edit" element={<ClassForm />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/subjects/:id" element={<SubjectDetail />} />
          <Route path="/subjects/new" element={<SubjectForm />} />
          <Route path="/subjects/:id/edit" element={<SubjectForm />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/timetable/:id" element={<TimetableDetail />} />
          <Route path="/timetable/new" element={<TimetableForm />} />
          <Route path="/timetable/:id/edit" element={<TimetableForm />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/attendance/new" element={<AttendanceForm />} />
          <Route path="/attendance/:id/edit" element={<AttendanceForm />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/grades/new" element={<GradesForm />} />
          <Route path="/grades/:id/edit" element={<GradesForm />} />
          <Route path="/grades/report/:student_id" element={<ReportCard />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/announcements/new" element={<AnnouncementsForm />} />
          <Route
            path="/announcements/:id/edit"
            element={<AnnouncementsForm />}
          />
          <Route path="/files/upload" element={<FileUpload />} />
          <Route path="/files" element={<Files />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/" element={<Login />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </ErrorBoundary>
  </QueryClientProvider>
);
