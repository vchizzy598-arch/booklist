const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();     

app.use(cors());            
app.use(bodyParser.json());

// ADD BOOK (POST)
app.post('/add-book', (req, res) => {
    const book = req.body;

    db.query("INSERT INTO book_list SET ?", book, (err, result) => {
        if (err) {
            console.error("Insert error:", err);
            return res.status(500).json({ error: "Database insert failed" });
        }
        res.json({ message: "Book added successfully", id: result.insertId });
    });
});

// GET ALL BOOKS (GET)
app.get('/books', (req, res) => {
    db.query("SELECT * FROM book_list", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// DELETE BOOK
app.delete('/delete-book/:isbn', (req, res) => {
    const bookIsbn = req.params.isbn;

    const sql = 'DELETE FROM book_list WHERE isbn = ?';
    db.query(sql, [bookIsbn], (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to delete book' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    });
});






// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
