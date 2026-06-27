const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: "Book not found for the given ISBN." });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      matchingBooks[key] = books[key];
    }
  });

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  }
  return res.status(404).json({ message: "No books found for the given author." });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      matchingBooks[key] = books[key];
    }
  });

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  }
  return res.status(404).json({ message: "No books found for the given title." });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "Book not found for the given ISBN." });
});

/*
 * Task 11: Retrieve book information using Promises / async-await with Axios.
 * These functions demonstrate fetching data from the local API endpoints
 * asynchronously. The server must be running for them to resolve.
 */

const BASE_URL = "http://localhost:5000";

// Task 10/11: Get all books – using async/await with Axios
const getAllBooks = async () => {
  const response = await axios.get(`${BASE_URL}/`);
  return response.data;
};

// Task 11: Get book details by ISBN – using Promise callbacks with Axios
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    axios.get(`${BASE_URL}/isbn/${isbn}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

// Task 11: Get book details by author – using async/await with Axios
const getBooksByAuthor = async (author) => {
  const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
  return response.data;
};

// Task 11: Get book details by title – using async/await with Axios
const getBooksByTitle = async (title) => {
  const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
  return response.data;
};

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
