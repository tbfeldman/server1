// app.js
const express = require('express');
const { books } = require('./db');

const app = express();
app.use(express.json()); 


app.get('/', (req, res) => {
  res.send('Welcome!!!!');
});


app.get('/books', (req, res) => {
  const { limit, page } = req.query;

  if (limit && page) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    const paginatedBooks = books.slice(startIndex, endIndex);
    return res.json({
      page: pageNum,
      limit: limitNum,
      totalBooks: books.length,
      data: paginatedBooks
    });
  }

  res.json(books);
});

// 2. קבלת ספר לפי קוד
app.get('/books/:code', (req, res) => {
  const code = parseInt(req.params.code);
  const book = books.find(b => b.code === code);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json(book);
});

// 3. הוספת ספר
app.post('/books', (req, res) => {
  const { code, name, category, price } = req.body;

  const existingBook = books.find(b => b.code === code);
  if (existingBook) {
    return res.status(400).json({ message: "Book code already exists" });
  }

  const newBook = {
    code,
    name,
    category,
    price,
    isBorrowed: false,
    borrowHistory: []
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// 4. עדכון ספר (ללא השאלות)
app.put('/books/:code', (req, res) => {
  const code = parseInt(req.params.code);
  const book = books.find(b => b.code === code);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const { name, category, price } = req.body;
  if (name !== undefined) book.name = name;
  if (category !== undefined) book.category = category;
  if (price !== undefined) book.price = price;

  res.json(book);
});

// 5. ביצוע השאלה
app.patch('/books/:code/borrow', (req, res) => {
  const code = parseInt(req.params.code);
  const { userId } = req.body;

  const book = books.find(b => b.code === code);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.isBorrowed) {
    return res.status(400).json({ message: "Book is already borrowed" });
  }

  book.isBorrowed = true;
  book.borrowHistory.push({
    borrowDate: new Date().toISOString().split('T')[0],
    userId: userId
  });

  res.json({ message: "Book borrowed successfully", book });
});

// 6. ביצוע החזרה
app.patch('/books/:code/return', (req, res) => {
  const code = parseInt(req.params.code);
  const book = books.find(b => b.code === code);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.isBorrowed) {
    return res.status(400).json({ message: "Book is not currently borrowed" });
  }

  book.isBorrowed = false;
  res.json({ message: "Book returned successfully", book });
});

// 7. מחיקת ספר לפי קוד
app.delete('/books/:code', (req, res) => {
  const code = parseInt(req.params.code);
  const index = books.findIndex(b => b.code === code);

  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const deletedBook = books.splice(index, 1);
  res.json({ message: "Book deleted successfully", book: deletedBook[0] });
});

// הרצת השרת
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});