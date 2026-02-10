const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

/**
 * TASK 10: Get the list of books available in the shop
 * Logic: Uses an asynchronous approach (Async/Await) with Axios to simulate 
 * fetching data from a remote server/database. This prevents blocking the 
 * main thread while the book list is being retrieved.
 */
public_users.get('/', async function (req, res) {
  try {
    // Simulating an external API call to fetch the books database
    const getBooks = await axios.get("http://localhost:5000/books");
    res.status(200).send(JSON.stringify(getBooks.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Internal helper endpoint to serve the books object for Axios calls
public_users.get('/books', function (req, res) {
    res.send(books);
});

/**
 * TASK 11: Get book details based on ISBN
 * Logic: Uses Promises to handle the asynchronous retrieval of a specific book.
 * It searches the books database for a key matching the ISBN provided in the URL.
 */
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Using Axios with a Promise (.then) to retrieve the book data
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
 * Logic: Iterates through the book list and filters entries where the author
 * matches the request parameter. Uses Promises to ensure non-blocking execution.
 */
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  axios.get('http://localhost:5000/books')
    .then(response => {
      const allBooks = response.data;
      // Filtering the books object by converting it to an array and checking author names
      const filteredBooks = Object.values(allBooks).filter(b => b.author === author);
      
      if (filteredBooks.length > 0) {
        res.status(200).json({ booksbyauthor: filteredBooks });
      } else {
        res.status(404).json({ message: "No books found by this author" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error fetching books by author" });
    });
});

/**
 * TASK 13: Get book details based on Title
 * Logic: Provides book details based on title using an asynchronous Axios call.
 * It utilizes the .then() promise callback to handle the successful data retrieval.
 */
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  axios.get('http://localhost:5000/books')
    .then(response => {
      const allBooks = response.data;
      // Searching for titles that match the requested string
      const filteredBooks = Object.values(allBooks).filter(b => b.title === title);
      
      if (filteredBooks.length > 0) {
        res.status(200).json({ booksbytitle: filteredBooks });
      } else {
        res.status(404).json({ message: "No books found with this title" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error fetching books by title" });
    });
});

/**
 * Get book review based on ISBN
 * This is a standard synchronous retrieval for initial setup.
 */
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "ISBN not found" });
  }
});

module.exports.general = public_users;
