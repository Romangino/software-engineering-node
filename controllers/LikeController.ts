/**
 * @file Controller RESTful Web service API for likes resource
 */
import {Express, Request, Response} from "express";
import LikeDao from "../daos/LikeDao";
import LikeControllerI from "../interfaces/likes/LikeControllerI";
import TuitDao from "../daos/TuitDao";
import DislikeDao from "../daos/DislikeDao";

/**
 * @class LikeController Implements RESTful Web service API for likes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/likes to retrieve all the tuits liked by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/likes to retrieve all users that liked a tuit
 *     </li>
 *     <li>POST /api/users/:uid/likes/:tid to record that a user likes a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/unlikes/:tid to record that a user
 *     no londer likes a tuit</li>
 * </ul>
 * @property {LikeDao} likeDao Singleton DAO implementing likes CRUD operations
 * @property {LikeController} LikeController Singleton controller implementing
 * RESTful Web service API
 */
export default class LikeController implements LikeControllerI {
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static dislikeDao: DislikeDao = DislikeDao.getInstance()
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static likeController: LikeController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express): LikeController => {
        if (LikeController.likeController === null) {
            LikeController.likeController = new LikeController();

            app.get("/api/users/:uid/likes",
                LikeController.likeController.findAllTuitsLikedByUser);

            app.get("/api/tuits/:tid/likes",
                LikeController.likeController.findAllUsersThatLikedTuit);

            app.put("/api/users/:uid/likes/:tid",
                LikeController.likeController.userTogglesTuitLikes);
        }
        return LikeController.likeController;
    }

    private constructor() {
    }

    /**
     * Retrieves all users that liked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatLikedTuit = (req: Request, res: Response) =>
        LikeController.likeDao.findAllUsersThatLikedTuit(req.params.tid)
            .then(likes => res.json(likes));

    /**
     * Retrieves all tuits liked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user liked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     */
    findAllTuitsLikedByUser = (req: Request, res: Response) =>
        LikeController.likeDao.findAllTuitsLikedByUser(req.params.uid)
            .then(likes => res.json(likes));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being liked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new likes that was inserted in the
     * database
     */
    userLikesTuit = (req: Request, res: Response) =>
        LikeController.likeDao.userLikesTuit(req.params.uid, req.params.tid)
            .then(likes => res.json(likes));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unliking
     * the tuit and the tuit being unliked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the like was successful or not
     */
    userUnlikesTuit = (req: Request, res: Response) =>
        LikeController.likeDao.userUnlikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being liked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new likes that was inserted in the
     * database
     */
    userTogglesTuitLikes = async (req: Request, res: Response) => {
        const likeDao = LikeController.likeDao;
        const dislikeDao = LikeController.dislikeDao
        const tuitDao = LikeController.tuitDao;
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            // Store if user liked or disliked a tuit
            const userAlreadyLikedTuit = await likeDao.findUserLikesTuit(userId, tid);
            const userAlreadyDislikedTuit = await dislikeDao.findUserDislikesTuit(userId, tid)

            // Store how many likes and dislikes a tuit has
            const howManyLikedTuit = await likeDao.countHowManyLikedTuit(tid)
            const howManyDislikedTuit = await dislikeDao.countHowManyDislikedTuit(tid)

            // Store tuit
            const tuit = await tuitDao.findTuitById(tid)

            // Check if user has already liked tuit
            if (userAlreadyLikedTuit) {
                await likeDao.userUnlikesTuit(userId, tid);
                tuit.stats.likes = howManyLikedTuit - 1;
            } else {
                if (userAlreadyDislikedTuit) {
                    // If user has remove dislike and decrease dislike count by 1
                    await dislikeDao.userUnDislikesTuit(userId, tid)
                    tuit.stats.likes = howManyDislikedTuit - 1
                }
                // User likes tuit and like count increased by 1
                await likeDao.userLikesTuit(userId, tid);
                tuit.stats.likes = howManyLikedTuit + 1;
            }
            // Update tuit stats with updated likes and dislikes
            await tuitDao.updateStats(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }
};