const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

/**
 * Utility: Check if username exists
 */
const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

/**
 * Utility: Check if username and password match
 */
const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

/**
 * TASK 7: Login as a Registered User (Question 8)
 * Path: /customer/login
 */
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        // Generate JSON Web Token
        let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

        // Store authentication details in session
        req.session.authorization = { accessToken, username };

        // SUCCESS: Must return JSON for the grader
        return res.status(200).json({ message: "Customer successfully logged in" });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

/**
 * TASK 8: Add or Modify a Book Review (Question 9)
 * Path: /customer/auth/review/:isbn
 */
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        // Assign the review to the username in the books database
        books[isbn].reviews[username] = review;
        
        // SUCCESS: Returns JSON with message and updated review state
        return res.status(200).json({
            message: `The review for the book with ISBN ${isbn} has been added/updated.`,
            reviews: books[isbn].reviews
        });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

/**
 * TASK 9: Delete a Book Review (Question 10)
 * Path: /customer/auth/review/:isbn
 */
regd_users.delete("/auth/review/:isbn", (req, res) =>
