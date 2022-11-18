/**
 * @file Implements mongoose schema for dislikes.
 */
import mongoose, {Schema} from "mongoose";
import Dislike from "../../models/dislikes/Dislike";

/**
 * @typedef DislikeSchema Represents dislikes
 * @property {ObjectId} tuit tuit PK
 * @property {ObjectId} likedBy user PK
 */
const DislikeSchema = new mongoose.Schema<Dislike>({
    tuit: {type: Schema.Types.ObjectId, ref: "TuitModel"},
    dislikedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "dislikes"});
export default DislikeSchema;