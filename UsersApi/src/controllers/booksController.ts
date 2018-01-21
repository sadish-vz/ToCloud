import { Get, Route } from "tsoa";
import { Book } from "../models/book";
import { BooksDB } from "../utils/booksDB";
import { connectDB } from "../utils/connectDB";

@Route('books')
export class BooksController {
    @Get('get/{userid}')
    public getBooks(userid : string): Promise<Book[]> {
        
        let connectionString: string = process.env.MONGODB_CONNECTIONSTRING ? 
        process.env.MONGODB_CONNECTIONSTRING : "mongodb://admin:abc123!@localhost/booksDB";
        
        let booksDB: BooksDB = new BooksDB(new connectDB(connectionString));
        return new Promise<Book[]>( (resolve, reject) => {
            booksDB.getBooks().then(books => {
                 resolve(books);
             }).catch(error => {
                 reject(error);
             });
        });
    }
}