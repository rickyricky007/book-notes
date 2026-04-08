import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

app.use (bodyParser.urlencoded({ extended:true }));
app.use (express.static("public"));
app.set ("view engine" , "ejs");

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

db.connect();

app.get("/", async (req,res) => {
    try{
        const result = await db.query("SELECT * FROM books ORDER BY id ASC");
        const books = result.rows;
        res.render("index.ejs" , { books:books });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading books!");
    }   
});

app.get("/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/add", async (req, res) => {
    try{
        const { title, author, rating, review, isbn, date_read } = req.body;
        await db.query(
            "INSERT INTO books (title, author, rating, review, isbn, date_read) VALUES ($1, $2, $3, $4, $5, $6)",
            [title, author, rating, review, isbn, date_read]
    );
    res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding book!");
    }  
});

app.get("/edit/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        const book = result.rows[0];
    res.render("edit.ejs", { book: book });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading book!");
    }    
});

app.post("/edit/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const { title, author, rating, review, isbn, date_read } = req.body;
        await db.query(
            "UPDATE books SET title = $1, author = $2, rating = $3, review = $4, isbn = $5, date_read = $6 WHERE id = $7",
            [title, author, rating, review, isbn, date_read, id]
        );
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating book!");
    }   
});

app.post("/delete/:id", async (req, res) => {
    try{
        const id = req.params.id;
        await db.query("DELETE FROM books WHERE id = $1", [id]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting book!");
    }    
});

app.listen(port , () => {
    console.log(`server is running on the port:${port}`);
});
