import mongoose from "mongoose";
import { marked } from "marked";
import slugify from "slugify";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const dompurify = createDOMPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
    title:{
        required: true,
        type: String
    },
    description:{
        type: String
    },
    markdown: {
        type: String,
        required: true,
    },
    dateOfCreation:{
        required: true,
        type: Date,
        default: Date.now,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    sanitizedHTML: {
        type: String,
        required: true,
    }
})

articleSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true});
    }

    if (this.markdown) {
        this.sanitizedHTML = dompurify.sanitize(marked(this.markdown));
    }

    next();
});

const Article = mongoose.model('Article', articleSchema);

export default Article;