/**
 * @file Implements DAO managing data storage of dislikes. Uses mongoose DislikeModel
 * to integrate with MongoDB
 */
import DislikeDaoI from "../interfaces/dislikes/DislikeDaoI";
import DislikeModel from "../mongoose/dislikes/DislikeModel";
import Dislike from "../models/dislikes/Dislike";

/**
 * @class DislikeDao Implements Data Access Object managing data storage
 * of Likes
 * @property {DislikeDao} dislikeDao Private single instance of LikeDao
 */
export default class DislikeDao implements DislikeDaoI {
    private static dislikeDao: DislikeDao | null = null

    /**
     * Creates singleton DAO instance
     * @returns DislikeDao
     */
    public static getInstance = (): DislikeDao => {
        if (DislikeDao.dislikeDao === null) {
            DislikeDao.dislikeDao = new DislikeDao()
        }
        return DislikeDao.dislikeDao
    }

    private constructor() {
    }

    /**
     * Counts how many users disliked tuit
     * @param {string} tid Tuit PK
     * @return Promise to be notified when count of dislikes is retrieved
     * from database
     */
    countHowManyDislikedTuit = async (tid: string): Promise<any> =>
        DislikeModel.count({tuit: tid})

    /**
     * Finds all Tuits disliked by a User.
     * @param {string} uid Primary key of user
     * @returns Promise To be notified when the tuits are retrieved from the
     * database
     */
    findAllTuitsDislikedByUser = async (uid: string): Promise<Dislike[]> =>
        DislikeModel.find({dislikedBy: uid})
            .populate("tuit")
            .exec()

    /**
     * Retrieves dislike of tuit by user if relation exists.
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @return Promise to be notified when dislike is found in database
     */
    findUserDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.findOne({tuit: tid, dislikedBy: uid})

    /**
     * Inserts dislike document for a dislike by a given user of a given tuit
     * into the database.
     * @param {string} uid Primary key of User
     * @param {string} tid Primary key of tuit
     * @returns Promise To be notified when dislike is inserted into the database
     */
    userDislikesTuit = async (tid: string, uid: string): Promise<Dislike> =>
        DislikeModel.create({tuit: tid, dislikedBy: uid})

    /**
     * Removes dislike document from the database.
     * @param {string} uid Primary key of user
     * @param {string} tid Primary key of tuit
     * @returns Promise To be notified when dislike is removed from the database
     */
    userUnDislikesTuit = async (tid: string, uid: string): Promise<any> =>
        DislikeModel.deleteOne({tuit: tid, dislikedBy: uid})



}