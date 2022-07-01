import mongoose from "mongoose";

const schema = mongoose.Schema;

const articleSchema = new schema({
    note: String,
    code: String,
    title: String,
    dificulty: String,
    language: String,
    topicId:String
} ,{ timestamps: true });

const Article = mongoose.model('article', articleSchema);


const topicSchema = new schema({
    name: String,
    user: String,
    articles: [articleSchema]
})

const Topic = mongoose.model('topic', topicSchema);


export { Topic, Article };