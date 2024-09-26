const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

async function getBookList(req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
}

async function getBookByISBN(req, res) {
    let isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
}

async function getBookByAuthor(req, res) {
    let author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
}

async function getBookByTitle(req, res) {
    let title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }

    return res.status(404).json({message: "Unable to reguster user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let index = req.params.isbn;
  let book = books[index];

  if (book) {
    return res.send(JSON.stringify(book,null,4));
  }

  return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let booksArray = Object.values(books);

    let book_found = booksArray.filter((book) => {
        return book.author === author;
    });

    if (book_found) {
        return res.send(JSON.stringify(book_found,null,4));
    }

    return res.status(404).json({message: "Author not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let booksArray = Object.values(books);

    let book_found = booksArray.filter((book) => {
        return book.title === title;
    });

    if (book_found) {
        return res.send(JSON.stringify(book_found,null,4));
    }

    return res.status(404).json({message: "Title not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let index = req.params.isbn;
    let book = books[index];

    if (book) {
        return res.send(JSON.stringify(book.reviews,null,4));
    }

    return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
