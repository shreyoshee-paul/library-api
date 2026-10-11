const express = require('express');
const app = express();
app.use(express.json());

// ================== Sample Data ==================
let books = [];
let members = [];
let borrowings = [];

// ================== Root Route ==================
app.get('/', (req, res) => {
  res.send('Library API is running');
});

// ================== Books CRUD ==================

// GET all books
app.get('/books', (req, res) => {
  res.json(books);
});

// GET one book
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// POST a new book
app.post('/books', (req, res) => {
  const { title, author, category } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
  const newBook = { id: books.length + 1, title, author, category, available: true };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT update book
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  Object.assign(book, req.body);
  res.json(book);
});

// DELETE book
app.delete('/books/:id', (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  books = books.filter(b => b.id != req.params.id);
  res.json({ message: 'Book deleted' });
});

// ================== Members CRUD ==================

// GET all members
app.get('/members', (req, res) => {
  res.json(members);
});

// GET one member
app.get('/members/:id', (req, res) => {
  const member = members.find(m => m.id == req.params.id);
  if (!member) return res.status(404).json({ message: 'Member not found' });
  res.json(member);
});

// POST a new member
app.post('/members', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  const newMember = { id: members.length + 1, name, email, phone };
  members.push(newMember);
  res.status(201).json(newMember);
});

// PUT update member
app.put('/members/:id', (req, res) => {
  const member = members.find(m => m.id == req.params.id);
  if (!member) return res.status(404).json({ message: 'Member not found' });
  Object.assign(member, req.body);
  res.json(member);
});

// DELETE member
app.delete('/members/:id', (req, res) => {
  const member = members.find(m => m.id == req.params.id);
  if (!member) return res.status(404).json({ message: 'Member not found' });
  members = members.filter(m => m.id != req.params.id);
  res.json({ message: 'Member deleted' });
});

// ================== Borrowings CRUD ==================

// GET all borrowings
app.get('/borrowings', (req, res) => {
  res.json(borrowings);
});

// GET one borrowing
app.get('/borrowings/:id', (req, res) => {
  const record = borrowings.find(b => b.id == req.params.id);
  if (!record) return res.status(404).json({ message: 'Borrowing record not found' });
  res.json(record);
});

// POST create borrowing record
app.post('/borrowings', (req, res) => {
  const { bookId, memberId, borrowDate } = req.body;

  if (!bookId || !memberId || !borrowDate) {
    return res.status(400).json({ message: 'bookId, memberId, and borrowDate are required' });
  }

  const book = books.find(b => b.id == bookId);
  const member = members.find(m => m.id == memberId);

  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!member) return res.status(404).json({ message: 'Member not found' });
  if (!book.available) return res.status(400).json({ message: 'Book not available' });

  const newBorrowing = {
    id: borrowings.length + 1,
    bookId,
    memberId,
    borrowDate,
    returnDate: null,
    status: 'borrowed'
  };

  borrowings.push(newBorrowing);
  book.available = false; // mark book unavailable
  res.status(201).json(newBorrowing);
});

// PUT update borrowing record (return book)
app.put('/borrowings/:id', (req, res) => {
  const record = borrowings.find(b => b.id == req.params.id);
  if (!record) return res.status(404).json({ message: 'Borrowing record not found' });

  Object.assign(record, req.body);

  // If book is returned, mark it available again
  if (record.status === 'returned' && record.returnDate) {
    const book = books.find(b => b.id == record.bookId);
    if (book) book.available = true;
  }

  res.json(record);
});

// DELETE borrowing record
app.delete('/borrowings/:id', (req, res) => {
  const record = borrowings.find(b => b.id == req.params.id);
  if (!record) return res.status(404).json({ message: 'Borrowing record not found' });
  borrowings = borrowings.filter(b => b.id != req.params.id);
  res.json({ message: 'Borrowing record deleted' });
});

// ================== Global Error Handler ==================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ================== Start Server ==================
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
