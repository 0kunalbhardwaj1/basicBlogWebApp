import express from 'express';
import Article from '../models/article.js';
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article });
});

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) res.redirect('/');
    res.render('articles/show', { article });
})

router.post('/', async (req, res, next) => {
    req.article = new Article();
    next();
},
saveArticleAndRedirect('new')
);

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
},
saveArticleAndRedirect('edit')
);

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        } catch (error) {
            res.render(`articles/${path}`, { article });
        }
    }
}

export default router;