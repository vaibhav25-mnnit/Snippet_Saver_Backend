import express, { response } from "express";
import mongoose from "mongoose";
import bodyParser from 'body-parser'
import cors from 'cors';
import axios from "axios";

/* declearing the app */
const app = express();


app.use(cors());
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
    Topic.findById(req.params.topicId, (err, done) => {
        if (err) res.status(501).send(err);
        else if (done) res.status(200).send(done);
    })
})


app.get('/article/:articleId/parent/:parentId', (req, res) => {


    Topic.findById(req.params.parentId, { articles: { $elemMatch: { _id: req.params.articleId } } }, (err, found) => {
        if (err) {
            res.status(501).send(err)
        } else if (found) {
            res.status(200).send(found.articles[0]);
        }
        else
            res.status(200).send("NO article found")
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
    const name = req.body.name;
    const dificulty = req.body.dificulty;


    const newArticle = new Article({
        note: note,
        code: code,
        name: name,
        dificulty: dificulty
    })
    // newArticle.save();

    Topic.findById(topicId, (err, done) => {
        if (err) res.status(501).send(err);
        else if (done) {
            done.articles.push(newArticle);
            done.save();
            res.status(200).send(done)
        };
    })

})

//6205468d7f08cacc14ee2672
// app.get('/delete/article/:id', (req, res) => {

//     Topic.updateupMany({}, { $pull: { articles: { _id: req.params.id } } }, (err, done) => {
//         if (err)
//             res.status(404).send(err)
//         else if (done)
//             res.status(200).send("done")
//         else
//             res.send(404).send('not found')
//     })


// })


//run code 
app.post('/run', (req, res) => {
    const reqestUrl = 'https://api.jdoodle.com/execute'
    //req.body.sript  req.body.stdinput
    const program =
    {
        script: req.body.script,
        language: 'cpp17',
        versionIndex: '0',
        clientId: 'f25137c59c048c71809daea0ac48e481',
        clientSecret: "e1dafa637fd03492ef477c81b737f5c5b3918947d99515b364a0ec1423b8478",
        stdin: req.body.stdinput
    }

    axios.post(reqestUrl, program)
        .then(response => res.status(200).send(response.data))
        .catch(err => res.status(200).send(err))

})



/* Listening app */
app.listen(process.env.PORT || 80, () => {
    console.log("Started .....")
})