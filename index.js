import express from "express";
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let posts = [];

app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("partials/index.ejs", { posts });
});

app.post("/add-post", (req, res) => {
    const { title, content } = req.body;
    if (title && content) {
        posts.push({ title, content });
        res.redirect("/");
    } else {
        res.status(400).send("Title and content are required.");
    }
});

app.post('/delete/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (!isNaN(index) && index >= 0 && index < posts.length) {
        posts.splice(index, 1); // Remove the post from the array
    }
    res.redirect('/');
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});