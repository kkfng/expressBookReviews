const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  console.log(books)
  return res.send(JSON.stringify({books},null,4));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
 
  return res.send(books[isbn]);
 });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author=req.params.author;

  for(let i=1;i<=10;i++){
      if(books[i].author===author)
      return res.send(books[i])
  }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title=req.params.title;

  for(let i=1;i<=10;i++){
      if(books[i].title===title)
      return res.send(books[i])
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
 const isbn=req.params.isbn;
 return res.send(books[isbn].reviews)
});


//  Get all books
function getAllBooks() {
    return new Promise((resolve, reject) => {
    resolve(books);
    });
   }getAllBooks();
  
public_users.get('/',async function (req, res) {
    const books_async=await getAllBooks();
    res.send(JSON.stringify(books_async,null,4));
});


// Get by ISBN
function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
    let isbnNumber = parseInt(isbn);
    if (books[isbnNumber]) {
    resolve(books[isbnNumber]);
    } else {
    reject({ status: 404, message: `ISBN ${isbn} not found` });
    }})
    }getByISBN(1)

public_users.get('/isbn/:isbn',function (req, res) {
    getBookByISBN(req.params.isbn).then(
        book=>res.send(JSON.stringify(book,null,4)))
    .catch(err => res.status(404).send(err));
 });


//  Get book by author
 function getBookByAuthor(author){
     return new Promise((resolve,reject)=>{
        let booksArray = Object.values(books);
        const book=booksArray.filter(book => book.author === author);
        if(book)
            resolve(book);
        else reject("Author not found");
     })
 }

public_users.get('/author/:author',function (req, res) {
    getBookByAuthor(req.params.author)
    .then(book => res.send(JSON.stringify(book,null,4)))
    .catch(err => res.status(404).send(err));
});


//  Get book by title
function getBookByTitle(title){
    return new Promise((resolve,reject)=>{
       let booksArray = Object.values(books);
       const book=booksArray.filter(book => book.title === title);
       if(book)
           resolve(book);
       else reject("Title not found");
    })
}

public_users.get('/title/:title',function (req, res) {
   getBookByTitle(req.params.title)
   .then(book => res.send(JSON.stringify(book,null,4)))
   .catch(err => res.status(404).send(err));
});

module.exports.general = public_users;
