# My Book Notes

A full-stack web app to track books you've read.

## Setup

1. Install dependencies:
    npm install

2. Create PostgreSQL database named `book` and run:
```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  author VARCHAR(200),
  rating INT,
  review TEXT,
  isbn VARCHAR(20),
  date_read DATE
);
```

3. Start the server:
    nodemon index.js

4. Open browser at `http://localhost:3000`

## Features
- Add books you have read
- View book covers from Open Library API
- Edit and delete books
- Rate and review books