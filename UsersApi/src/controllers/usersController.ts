import { Get, Route, Body, Post } from "tsoa";
import { atob } from "atob";
import { usersDB } from "../utils/usersDB";
import { connectDB } from "../utils/connectDB";
import { get } from "http";
import { User } from "../models/user";
import { error, log } from "util";
import { loggedIn } from "../models/loggedIn";

@Route('users')
export class UsersController {
    @Get('isAuthenticated/{checkuser}')
    public async isAuthenticatedUser(checkuser: string): Promise<boolean> {

        let connectionString: string = process.env.MONGODB_CONNECTIONSTRING ?
            process.env.MONGODB_CONNECTIONSTRING : "mongodb://admin:abc123!@localhost/usersDB";

        let decodeduser: User = JSON.parse(atob(checkuser));
        let usersdb: usersDB = new usersDB(new connectDB(connectionString), decodeduser);
        return new Promise<boolean>((resolve, reject) => {
            usersdb.isAuthenticated().then(item => {
                resolve(item);
            }).catch(error => reject(error));
        });
    }

    @Post('isAuthenticated')
    public async Authenticate( @Body() login: loggedIn): Promise<loggedIn> {
        let connectionString: string = process.env.MONGODB_CONNECTIONSTRING ?
            process.env.MONGODB_CONNECTIONSTRING : "mongodb://admin:abc123!@localhost/usersDB";

        let decodeduser: User;
        try {
            decodeduser = JSON.parse(atob(login.checkUser));
        } catch (e) {
            login.isAuthenticated = false;
            return new Promise<loggedIn>((resolve, reject) => {
                resolve(login);
            });
        }
        let usersdb: usersDB = new usersDB(new connectDB(connectionString), decodeduser);
        return new Promise<loggedIn>((resolve, reject) => {
            usersdb.isAuthenticated().then(item => {
                login.isAuthenticated = item;
                resolve(login);
            }).catch(error => reject(error));
        });
    }
}