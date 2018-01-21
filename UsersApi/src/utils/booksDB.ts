import * as util from "util";
import * as mongodb from "mongodb";
import { Book } from "../models/book";
import { connectDB } from "../utils/connectDB";

export class BooksDB {
    private connect: connectDB;

    constructor(connect: connectDB) {
        this.connect = connect;
    }

    public getBooks(): Promise<Book[]> {
        return this.connect.connectDB().then(db => {
            let collection: mongodb.Collection = db.collection('books');
            return new Promise<Book[]>((resolve, reject) => {
                let books: Book[] = [];
                collection.find().toArray().then(docs => {
                    docs.map((doc: Book) => {
                        let book: Book = new Book();
                        book.name = doc.name;
                        book.authorName = doc.authorName;
                        books.push(book);
                    })
                    resolve(books);
                }).catch(error => {
                    reject(error);
                })
            })
        });
    }

    public insertBook(book: Book): Promise<Book> {
        return this.connect.connectDB().then(db => {
            let collection: mongodb.Collection = db.collection('books');
            return new Promise<Book>((resolve, reject) => {
                collection.insert(book).then(result => {
                    resolve(book);
                }).catch(error => {
                    reject(error);
                });
            })
        });
    }
}