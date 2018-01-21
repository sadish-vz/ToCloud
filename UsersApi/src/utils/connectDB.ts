import * as util from "util";
import * as mongodb from "mongodb";
import { MongoClient } from "mongodb";
import { resolve } from "path";
import { error } from "util";

export class connectDB {
    private mongoClient: MongoClient;
    private db: mongodb.Db;
    private connectionString: string;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
        this.mongoClient = new MongoClient();
    }

    public connectDB(): Promise<mongodb.Db> {
        return new Promise<mongodb.Db>((resolve, reject) => {
            if (this.db) return this.db;
            this.mongoClient.connect(this.connectionString, (error: mongodb.MongoError, _db: mongodb.Db) => {
                if (error) reject(error);
                this.db = _db;
                resolve(this.db);
            });
        });
    }

    public Close(): void {
        this.db.close();
    }
}