/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB
 */
import TuitModel from "../mongoose/tuits/TuitModel";
import Tuit from "../models/tuits/Tuit";
import TuitDaoI from "../interfaces/tuits/TuitDaoI";
import Stats from "../models/tuits/Stats";


/**
 * @class TuitDao Implements Data Access Object managing data storage
 * of Tuits
 * @property {TuitDao} tuitDao Private single instance of UserDao
 */
export default class TuitDao implements TuitDaoI {
    private static tuitDao: TuitDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns TuitDao
     */
    public static getInstance = (): TuitDao => {
        if (TuitDao.tuitDao === null) {
            TuitDao.tuitDao = new TuitDao();
        }
        return TuitDao.tuitDao;
    }

    public constructor() {
    }


    /**
     * Retrieves all tuit documents from the database.
     * @returns Promise To be notified when the tuits are retrieved from
     * database
     */
    findAllTuits = async (): Promise<Tuit[]> =>
        TuitModel.find()
            .populate("postedBy")
            .exec();

    /**
     * Retrieves tuit with given primary key.
     * @param {string} uid Primary key of user
     * @returns Promise To be notified when the tuit is retrieved from database
     */
    findTuitsByUser = async (uid: string): Promise<Tuit[]> =>
        TuitModel.find({postedBy: uid})
            .populate("postedBy")
            .exec();

    /**
     * Retrieves tuit with given primary key.
     * @param {string} tid Primary key of user
     * @returns Promise To be notified when the tuit is retrieved from database
     */
    findTuitById = async (tid: string): Promise<any> =>
        TuitModel.findById(tid)
            .populate("postedBy")
            .exec();


    /**
     * Inserts tuit document into the database.
     * @param {string} uid User to link to tuit
     * @param {Tuit} tuit
     * @returns Promise To be notified when tuit is inserted into the database
     */
    createTuitByUser = async (uid: string, tuit: Tuit): Promise<Tuit> =>
        TuitModel.create({...tuit, postedBy: uid});


    /**
     * Updates tuit with new values in the database.
     * @param {string} tid Primary key of tuit
     * @param {Tuit} tuit Tuit body with new values for tuit
     */
    updateTuit = async (tid: string, tuit: Tuit): Promise<any> =>
        TuitModel.updateOne(
            {_id: tid},
            {$set: tuit});

    /**
     * Removes tuit document with a given primary key from the database.
     * @param {string} tid Primary key of tuit
     * @returns Promise To be notified when tuit is removed from the database
     */
    deleteTuit = async (tid: string): Promise<any> =>
        TuitModel.deleteOne({_id: tid});

    /**
     * Updates likes stats with new values in the database.
     * @param {string} tid Primary key of tuit
     * @param {Stats} newStats new stats for the tuit
     */
    updateStats = async (tid: string, newStats: Stats) =>
        TuitModel.updateOne(
            {_id: tid},
            {$set: {stats: newStats}}
        )
}

