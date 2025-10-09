import mongoose,{Schema} from "mongoose";
export class MainSchematic{
    constructor(){
        this.Schema = mongoose.Schema;
    }
    static userSchema = new Schema({
        email: String,
        name: String,
        password: String,
        reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
        created_at: { type: Date, default: Date.now }
    });
    static userModel = mongoose.model ('User',this.userSchema);
    // models/Place.js
    static placeSchema = new Schema({
    name: String,
    address: String,
    images: [
        {
        url: String,
        alt_text: String
        }
    ],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    created_at: { type: Date, default: Date.now }
    });

    static placesModel = mongoose.model('Place', this.placeSchema);
    // models/Review.js
    static reviewSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    place_id: { type: Schema.Types.ObjectId, ref: 'Place' },
    content: String,
    rating: Number,
    images: [
        {
        url: String,
        alt_text: String
        }
    ],
    created_at: { type: Date, default: Date.now }
    });
    static ReviewModel = mongoose.model('Review', this.reviewSchema);
}