const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

/**
 * TASK 10: Get the list of books available in the shop
 * Logic: Uses Async/Await with Axios to fetch the local books database.
 * This demonstrates handling asynchronous data retrieval at the root endpoint.
 */
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/books'); // Simulating API call
        res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books list", error: error.message });
    }
});

// Helper endpoint used by Axios to simulate an external API
public_users.get('/books', function (req, res) {
    res.send(books);
});

/**
 * TASK 11: Get book details based on ISBN
 * Logic: Uses Promises with Axios to retrieve a specific book by its ISBN.
 * Error handling manages cases where the ISBN does not exist in the database.
 */
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/books`)
        .then(response => {
            const book = response.data[isbn];
            if (book) {
                res.status(200).send(JSON.stringify(book, null, 4));
            } else {
                res.status(404).json({ message: "Book not found" });
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Error fetching book by ISBN" });
        });
});

/**
 * TASK 12: Get book details based on Author
 * Logic: Uses Promises with Axios to filter the book list by author.
 * Matches the requested format by returning an array of books for the specified author.
 */
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    axios.get('http://localhost:5000/books')
        .then(response => {
            const allBooks = response.data;
            const filteredBooks = Object.values(allBooks).filter(b => b.author === author);
            res.status(200).json({ booksbyauthor: filteredBooks });
        })
        .catch(err => {
            res.status(500).json({ message: "Error fetching books by author" });
        });
});

/**
 * TASK 13: Get book details based on Title
 * Logic: Uses Promises with Axios to filter books by title.
 * Provides a clear JSON structure for the returned list of books.
 */
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get('http://localhost:5000/books')
        .then(response => {
            const allBooks = response.data;
            const filteredBooks = Object.values(allBooks).filter(b => b.title === title);
            res.status(200).json({ booksbytitle: filteredBooks });
        })
        .catch(err => {
            res.status(500).json({ message: "Error fetching books by title" });
        });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && Object.keys(book.reviews).length > 0) {
        res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
        res.status(404).json({ message: "No reviews found for this book." });
    }
});

module.exports.general = public_users;
