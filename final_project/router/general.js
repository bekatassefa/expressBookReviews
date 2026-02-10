const axios = require('axios');

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    // In a real scenario, this would be your server's URL
    const response = await axios.get('http://localhost:5000/books');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list" });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/books/${isbn}`)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(404).json({ message: "Book not found" });
    });
});

// Task 12: Get book details based on Author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  axios.get('http://localhost:5000/books')
    .then(response => {
      const books = response.data;
      const filtered = Object.values(books).filter(b => b.author === author);
      res.status(200).json(filtered);
    })
    .catch(err => res.status(500).json({ message: "Error" }));
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get('http://localhost:5000/books')
    .then(response => {
      const books = response.data;
      const filtered = Object.values(books).filter(b => b.title === title);
      res.status(200).json(filtered);
    })
    .catch(err => res.status(500).json({ message: "Error" }));
});
