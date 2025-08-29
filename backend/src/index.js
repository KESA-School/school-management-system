const express = require('express');
const pino = require('pino-http')();
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const classRoutes = require('./routes/classes');
const subjectRoutes = require('./routes/subjects');
const timetableRoutes = require('./routes/timetable');
const attendanceRoutes = require('./routes/attendance');
const gradesRoutes = require('./routes/grades');
const announcementsRoutes = require('./routes/announcements');
const filesRoutes = require('./routes/files');
const auditLogsRoutes = require('./routes/audit_logs');
const app = express();

app.use(express.json());
app.use(pino);
app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);
app.use('/classes', classRoutes);
app.use('/subjects', subjectRoutes);
app.use('/timetable', timetableRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/grades', gradesRoutes);
app.use('/announcements', announcementsRoutes);
app.use('/files', filesRoutes);
app.use('/audit-logs', auditLogsRoutes);

app.get('/health', (req, res) => {
  req.log.info('Health check');
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
