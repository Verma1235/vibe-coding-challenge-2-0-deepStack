import mongoose from 'mongoose';

const MatchScoreSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0 // Score negative nahi ho sakta
  }
}, { _id: false });

const MatchSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Match date is required'],
  },
  sport: {
    type: String,
    required: [true, 'Sport is required'],
  },
  opponent: {
    type: String,
    required: [true, 'Opponent name is required'],
  },
  scores: [MatchScoreSchema] // Jis player ne match khela uska score
}, { timestamps: true });

const Match = mongoose.models.Match || mongoose.model('Match', MatchSchema);

export default Match;