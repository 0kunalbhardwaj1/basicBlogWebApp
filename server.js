import express from 'express';
import mongoose from 'mongoose';
import Article from './models/article.js';
import articleRouter from './routes/articles.js';
import methodOverride from 'method-override';

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost/blog');

app.set('view engine', 'ejs'); //modularity

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({
        dateOfCreation: 'desc'
    });
    res.render('articles/index', { articles });
});

app.use('/articles', articleRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})