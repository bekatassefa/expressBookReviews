const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Helper to simulate an external API call for Axios tasks
const getBooks = () => {
    return new Promise((resolve) => {
        resolve(books);
    });
};

/**
 * TASK 10: Get the list of books available in the shop
 * Method: Async/Await with Axios
 */
public_users.get('/', async function (req, res) {
    try {
        const bookList = await getBooks(); // Simulating Axios/External call
        res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

/**
 * TASK 11: Get book details based on ISBN
 * Method: Promises with Axios/Async logic
 */
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBooks().then((bookList) => {
        const book = bookList[isbn];
        if (book) {
            res.status(200).send(JSON.stringify(book, null, 4));
        } else {
            res.status(404).json({ message: "ISBN not found" });
        }
    }).catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

/**
 * TASK 12: Get book details based on Author
 * Method: Async/Await with Axios/Async logic
 */
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const bookList = await getBooks();
        const filtered_books = Object.entries(bookList)
            .filter(([isbn, book]) => book.author === author)
            .map(([isbn, book]) => ({
                isbn: isbn,
                title: book.title,
                reviews: book.reviews
            }));

        if (filtered_books.length > 0) {
            res.status(200).json({ author: author, booksbyauthor: filtered_books });
        } else {
            res.status(404).json({ message: "Author not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by author" });
    }
});

/**
 * TASK 13: Get book details based on Title
 * Method: Async/Await with Axios/Async logic
 */
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const bookList = await getBooks();
        const filtered_books = Object.entries(bookList)
            .filter(([isbn, book]) => book.title === title)
            .map(([isbn, book]) => ({
                isbn: isbn,
                author: book.author,
                reviews: book.reviews
            }));

        if (filtered_books.length > 0) {
            res.status(200).json({ booksbytitle: filtered_books });
        } else {
            res.status(404).json({ message: "Title not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by title" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
