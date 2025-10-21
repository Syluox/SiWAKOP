import mongoose, { Schema } from "mongoose";

// Define schemas
const reviewSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    place_id: { type: Schema.Types.ObjectId, ref: 'Place' },
    content: String,
    rating: Number,
    images: [{
        url: String,
        alt_text: String
    }],
    created_at: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { // Assuming you have password for auth
    type: String,
    required: true
  },
created_at: { 
    type: Date, 
    default: Date.now 
},
  planning: [{
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
    },
    status: {
      type: String,
      enum: ['planned', 'done', 'cancelled'],
      default: 'planned'
    },
    plannedDate: {
      type: Date,
      default: Date.now
    },
    completedDate: {
      type: Date
    }
  }]
});

const placeSchema = new Schema({
        name: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        address: { type: String, required: true },
        kecamatan: { type: String, required: true },
        operating_hours: {
            type: { type: String, enum: ['24_hour', 'daily', 'weekday_only'], required: true },
            start: { type: String, default: '' },
            end: { type: String, default: '' }
        },
        price: {
            entry_fee: { type: Number, default: 0 },
            parking_bike: { type: Number, default: 0 },
            parking_car: { type: Number, default: 0 },
            note: { type: String, default: '' }
        },
        facilities: [{ type: String }],
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        photo_url: { type: String, default: '' },
        reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
        created_at: { type: Date, default: Date.now }
    });

// Create models in the correct order: Review first, then User and Place
const Review = mongoose.model('Review', reviewSchema);
const User = mongoose.model('User', userSchema);
const Place = mongoose.model('places', placeSchema);

export { User, Place, Review };