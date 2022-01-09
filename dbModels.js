import mongoose from "mongoose";

const schema = mongoose.Schema;

const articleSchema = new schema({
    note: String,
    code: String,
    name: String,
    dificulty: String
});

const Article = mongoose.model('article', articleSchema);


const topicSchema = new schema({
    name: String,
    imgAddress: String,
    articles: [articleSchema]
})

const Topic = mongoose.model('topic', topicSchema);


export { Topic, Article };