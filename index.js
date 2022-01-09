import express from "express";
import mongoose from "mongoose";
import bodyParser from 'body-parser'

/* declearing the app */
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


import { Topic, Article } from "./dbModels.js"

/* connecting to database */
const dbURL = `mongodb+srv://vaibhav_55:pbxRUqtxfowCohE9@webster.aakb9.mongodb.net/DsAlgoDb?retryWrites=true&w=majority`

mongoose.connect(dbURL)
    .then(console.log("connected to database..."))
    .catch((err) => console.log(err))


/* get topics  route */
app.get('/', (req, res) => {
    Topic.find((err, found) => {
        if (err) res.send(err)
        else if (found) {
            res.send(found);
        }
    })
})



/* for particuler topic articles */
app.get('/topic/:topicId', (req, res) => {
    console.log(req.params.topicId)
    Topic.findById(req.params.topicId, (err, done) => {
        if (err) res.status(501).send(err);
        else if (done) res.status(200).send(done);
    })
})



/* for adding new topic */
app.post('/addtopic/', (req, res) => {

    const imgURL = req.body.imgUrl;
    const name = req.body.name;


    const newTopic = new Topic({
        name: name,
        imgAddress: imgURL,
        articles: []
    })

    newTopic.save()
        .then(res.send("data saved"))
        .catch((err) =>
            res.send(err))

})


/* for adding new article */
app.post('/addarticle/', (req, res) => {

    // console.log(req.body);
    const topicId = req.body.topicId;
    const note = req.body.note;
    const code = req.body.code;
    const problems = req.body.problems;


    const newArticle = new Article({
        note: note,
        code: code,
        problems: problems
    })

    Topic.findById(topicId, (err, done) => {
        if (err) res.status(501).send(err);
        else if (done) {
            done.articles.push(newArticle);
            done.save();
            res.status(200).send(done)

        };
    })

})



/* Listening app */
app.listen(process.env.PORT || 80, () => {
    console.log("Started .....")
})