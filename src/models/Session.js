import mongoose from 'mongoose';

const AttendanceRecordSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User model (jiska role 'player' hai) se link karta hai
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true
  }
}, { _id: false }); // Sub-document ke liye alag ID ki zaroorat nahi

const SessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Session date is required'],
  },
  sport: {
    type: String,
    required: [true, 'Sport is required'],
  },
  isClosed: {
    type: Boolean,
    default: false, // Default: session open rahega till coach closes it
  },
  attendance: [AttendanceRecordSchema] // Attendance records ka array
}, { timestamps: true });

const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);

export default Session;