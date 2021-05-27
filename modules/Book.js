'use strict'; 

const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const BookModel = require('../model/Users');
const { verify } = require('crypto');

const client = jwksClient ({
    jwksUri: 'http://dev-nt37xvb0.us.auth0.com/.well-known/jwks.json'
});

function verifyToken(token, callback) {
    jwt.verify(token, getKey, {}, (err, user) => {
        if(err){
        console.error('Something Went Wrong');
        return callback(err); 
        }
        callback(user); 
        }
    )};
    function getKey(header, callback) {
        client.getSigningKey(header.kid, function(err, key) {
        const signInKey = key.publicKey || key.rsaPublicKey; 
        callback(null, signInKey); 
        });
    }
const Book = {};

Book.getAllBooks = async function(request, response) {
    const token = request.headers.authorization.split(' ')[1];
    verifyToken(token, getBooks(user));
    
    async function getBooks(user){
    const name = user.name;
    
    await BookModel.find({ name }, (err, person) => {
        if(err) console.error(err);
            if(!person.length){
                person[0] = { name, books: [] }
                const newUser = new BookModel(person[0])
                newUser.save();
            }
            response.send(person[0].books);
        });
    }
}

Book.addABook = async function(request, response) {
    const token = request.headers.authorization.split(' ')[1];
    verifyToken(token, getBooks(user));

    async function addBook(user) {
        const name = user.name;
        const {newBook, newBookAuthor} = request.query; 
        
        await BookModel.find({ name }, (err, person) => {
            if(err) console.error(err);
                person[0].books.push({title: newBook, author: newBookAuthor });
                person[0].save();
                response.send(person[0].books);
        });
    }
}

Book.deleteABook = async function(request, response) {
    const token = request.headers.authorization.split(' ')[1];
    verifyToken(token, getBooks(user));
    
    async function deleteBook(user) {
        const indexNum = request.params.index;
        const index = parseInt(indexNum);
        const name = user.name;
        
        await BookModel.find({name }, (err, person) => {
            if(err) console.log(err)
            const newBookwArray = person[0].books.filter((book, i) => i !== index);
            user[0].books = newBookArray;
            user[0].save();
            response.send('success!');
        })
    }
}
    

module.exports = Book;
