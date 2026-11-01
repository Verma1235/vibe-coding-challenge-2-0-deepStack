import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Please provide a username for login'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    // In production, NEVER store plain text passwords. We will hash this later if time permits, 
    // or just use basic matching for the hackathon logic focus.
  },
  role: {
    type: String,
    enum: ['coach', 'player', 'scout'],
    required: true,
  },
  // Niche ke fields strictly players ke liye hain
  age: {
    type: Number,
    required: function() { return this.role === 'player'; } // Required only if role is player
  },
  sport: {
    type: String,
    required: function() { return this.role === 'player'; }
  }
}, { timestamps: true });

// Next.js hot-reloading ki wajah se, agar model pehle se bana hai toh wahi use karo, warna naya banao
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;