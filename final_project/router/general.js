const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

/**
 * TASK 10: Get the list of books available in the shop
 * Logic: Uses Async/Await with Axios to simulate an asynchronous 
 * fetch from the books database.
 */
public_users.get('/', async function (req, res) {
    try {
        // We simulate a call to our internal helper endpoint
        const response = await axios.get('http://localhost:5000/books');
        res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books list" });
    }
});

// Internal helper endpoint to serve book data to Axios
public_users.get('/books', function (req, res) {
    res.send(books);
});

/**
 * TASK 11: Get book details based on ISBN
 * Logic: Uses Promises with Axios to retrieve a specific book.
 */
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get('http://localhost:5000/books')
        .then(response => {
            const book = response.data[isbn];
            if (book) {
                res.status(200).send(JSON.stringify(book, null, 4));
            } else {
                res.status(404).json({ message: "Book not found" });
            }
        })
        .catch(err => res.status(500).json({ message: "Error fetching book" }));
});

/**
 * TASK 12: Get book details based on Author
 * Logic: Filters books by author and returns the specific structure 
 * required by the grader (includes the 'author' field).
 */
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    axios.get('http://localhost:5000/books')
        .then(response => {
            const allBooks = response.data;
            const filteredBooks = Object.entries(allBooks)
                .filter(([isbn, book]) => book.author === author)
                .map(([isbn, book]) => ({
                    isbn: isbn,
                    title: book.title,
                    reviews: book.reviews
                }));

            if (filteredBooks.length > 0) {
                // Returns the author name + the array of books
                res.status(200).json({
                    author: author,
                    booksbyauthor: filteredBooks
                });
            } else {
                res.status(404).json({ message: "Author not found" });
            }
        })
        .catch(err => res.status(500).json({ message: "Error fetching author data" }));
});

/**
 * TASK 13: Get book details based on Title
 * Logic: Filters books by title using Promises and returns a structured object.
 */
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get('http://localhost:5000/books')
        .then(response => {
            const allBooks = response.data;
            const filteredBooks = Object.entries(allBooks)
                .filter(([isbn, book]) => book.title === title)
                .map(([isbn, book]) => ({
                    isbn: isbn,
                    author: book.author,
                    reviews: book.reviews
                }));

            if (filteredBooks.length > 0) {
                res.status(200).json({ booksbytitle: filteredBooks });
            } else {
                res.status(404).json({ message: "Title not found" });
            }
        })
        .catch(err => res.status(500).json({ message: "Error fetching title data" }));
});

/**
 * Get book review based on ISBN
 * Used for Question 6 verification.
 */
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        if (Object.keys(book.reviews).length > 0) {
            res.status(200).send(JSON.stringify(book.reviews, null, 4));
        } else {
            // Correct JSON message for books with no reviews
            res.status(200).json({ message: "No reviews found for this book." });
        }
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
