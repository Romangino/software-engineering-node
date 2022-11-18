/**
 * @file Declare Stats data type representing a stats of a tuit.
 */

/**
 * @typedef Stats Represents a Stats
 * @property {number} replies The amount of replies for a tuit
 * @property {number} retuits The amount of retuits for a tuit
 * @property {number} likes The amount of likes for a tuit
 * @property {number} dislikes The amount of dislikes for a tuit
 */
export default interface Stats {
    replies: number,
    retuits: number,
    likes: number,
    dislikes: number
}