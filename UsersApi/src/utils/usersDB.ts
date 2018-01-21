import * as util from "util";
import * as mongodb from "mongodb";
import { MongoClient } from "mongodb";
import { User } from "../models/user";
import { connectDB } from "../utils/connectDB";
import { resolve } from "url";

export class usersDB {
    private connect: connectDB;
    private user: User;

    constructor(connect: connectDB, user: User) {
        this.connect = connect;
        this.user = user;
        console.log(user);
    }

    public isAuthenticated(): Promise<boolean> {
        return this.connect.connectDB().then(db => {
            let collection: mongodb.Collection = db.collection("users");
            return new Promise<boolean>((resolve, reject) => {
                //if (this.user && (this.user.password != "" || this.user.userName != "")) resolve(false);
                collection.find(this.user).toArray().then(docs => {
                    if (docs.length == 0) resolve(false);
                    else {
                        docs.map((doc: User[]) => {
                            if (doc)
                                resolve(true);
                            else
                                resolve(false);
                        })
                    }
                }).catch(error => reject(error));
            })
        })
    }
}