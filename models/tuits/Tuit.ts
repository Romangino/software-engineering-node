/**
 * @file Declare Tuit data type representing a tuit posted by a user.
 */

import User from "../users/User";
import Stats from "./Stats";
/**
 * @typedef Tuit Represents a tuit
 * @property {string} id The id of a tuit
 * @property {string} tuit The content of a tuit
 * @property {Date} postedOn Date the tuit was posted on
 * @property {User} postedBy User that the tuit was posted by
 * @property {Stats} stats Stats of the tuit
 */

export default interface Tuit {
    id: string,
    tuit: string,
    postedBy: User,
    postedOn?: Date,
    stats: Stats
}


// private id: string;
// private tuit: string;
// private postedOn: Date;
// private postedBy: User | null;

// constructor(id: string, tuit: string, postedOn: Date, postedBy: any) {
//     this.id = id;
//     this.tuit = tuit;
//     this.postedOn = postedOn;
//     this.postedBy = postedBy;
// }
//
// public get getTuit(): string {
//     return this.tuit;
// }
//
// public set setTuit(tuit: string) {
//     this.tuit = tuit;
// }
//
// public get getPostedOn(): Date {
//     return this.postedOn;
// }
//
// public set setPostedOn(postedOn: Date) {
//     this.postedOn = postedOn;
// }
//
// public get getAuthor(): User | null {
//     return this.postedBy;
// }
//
// public set setAuthor(user: User | null) {
//     this.postedBy = user;
// }

