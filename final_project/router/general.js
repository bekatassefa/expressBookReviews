const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

/**
 * TASK 10: Get the list of books available in the shop
 * Method: Async/Await with Axios
 * Logic: Fetches the books database asynchronously to simulate 
 * an external API call, ensuring the server remains non-blocking.
 */
public_users.get('/', async function (req, res) {
  try {
    // Calling our internal endpoint to fetch data via Axios
    const response = await axios.get('http://localhost:5000/books');
    res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list" });
  }
});

// Internal helper route to serve the books object for Axios
public_users.get('/books', function (req, res) {
    res.send(books);
});

/**
 * TASK 11: Get book details based on ISBN
 * Method: Promises (.then) with Axios
 * Logic: Retrieves specific book data by its ISBN key using a Promise callback.
 */
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get('http://localhost:5000/books')
    .then((response) => {
      const book = response.data[isbn];
      if (book) {
        res.status(200).send(JSON.stringify(book, null, 4));
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching book by ISBN" });
    });
});

/**
 * TASK 12: Get book details based on Author
 * Method: Promises (.then) with Axios
 * Logic: Filters through the books object to find all titles matching 
 * the author. Returns a structured JSON object as required by the rubric.
 */
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  axios.get('http://localhost:5000/books')
    .then((response) => {
      const allBooks = response.data;
      const filteredBooks = Object.entries(allBooks)
        .filter(([isbn, book]) => book.author === author)
        .map(([isbn, book]) => ({
          isbn: isbn,
          title: book.title,
          reviews: book.reviews
        }));

      if (filteredBooks.length > 0) {
        res.status(200).json({ author: author, booksbyauthor: filteredBooks });
      } else {
        res.status(404).json({ message: "No books found for this author" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching books by author" });
    });
});

/**
 * TASK 13: Get book details based on Title
 * Method: Promises (.then) with Axios
 * Logic: Performs an asynchronous search across the book list to find 
 * matches for the specified title.
 */
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get('http://localhost:5000/books')
    .then((response) => {
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
        res.status(404).json({ message: "Book title not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching books by title" });
    });
});

/**
 * Get book reviews based on ISBN
 */
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
      if (Object.keys(book.reviews).length > 0) {
          res.status(200).send(JSON.stringify(book.reviews, null, 4));
      } else {
          res.status(200).json({ message: "No reviews found for this book." });
      }
  } else {
      res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
