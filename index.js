import express, { response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/* declearing the app */
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import { Topic, Article } from "./dbModels.js";

/* connecting to database */
const dbURL = process.env.DB_URL;

mongoose
  .connect(dbURL)
  .then(console.log("connected to database..."))
  .catch((err) => console.log(err));

/* get topics  route */
app.get("/", (req, res) => {
  res.send("Hello from server😁");
});

/* finding the topic's of certain user */
app.get("/user/:user", (req, res) => {
  Topic.find({ user: req.params.user }, (err, done) => {
    if (err) res.send(err);
    else if (done) res.status(200).send(done);
  });
});

/* for particuler topic articles */
app.get("/topic/:topicId", (req, res) => {
  Topic.findById(req.params.topicId, (err, done) => {
    if (err) res.status(501).send(err);
    else if (done) res.status(200).send(done);
  });
});

/*finding the particular*/
app.get("/article/:articleId/parent/:parentId", (req, res) => {
  Topic.findById(
    req.params.parentId,
    { articles: { $elemMatch: { _id: req.params.articleId } } },
    (err, found) => {
      if (err) {
        res.status(501).send(err);
      } else if (found) {
        res.status(200).send(found.articles[0]);
      } else res.status(200).send("NO article found");
    }
  );
});

/* for adding new topic */
app.post("/addtopic/", (req, res) => {
  const name = req.body.name;
  const user = req.body.user;

  const newTopic = new Topic({
    name: name,
    user: user,
    articles: [],
  });

  newTopic
    .save()
    .then(res.send("data saved"))
    .catch((err) => res.send(err));
});

/* delete the topic */
app.get("/deleteTopic/:id/", (req, res) => {
  Topic.deleteOne({ _id: req.params.id }, (err, done) => {
    if (err) res.send(err);
    else if (done) res.status(200).send("Deleted successfully");
  });
});

/* for adding new article */
app.post("/addarticle/", (req, res) => {
  const topicId = req.body.topicId;

  const newArticle = new Article({
    note: req.body.note,
    code: req.body.code,
    title: req.body.title,
    dificulty: req.body.dificulty,
    language: req.body.language,
  });
  // newArticle.save();

  Topic.findById(topicId, (err, done) => {
    if (err) res.status(501).send(err);
    else if (done) {
      done.articles.push(newArticle);
      done.save();
      res.status(200).send(done);
    }
  });
});

//to get exact article through parent
app.get("/delete/article/:id/:parent", (req, res) => {
  Topic.updateOne(
    { _id: req.params.parent },
    { $pull: { articles: { _id: req.params.id } } },
    (err, done) => {
      if (err) res.status(404).send(err);
      else if (done) res.status(200).send("deleted");
      else res.send(404).send("not found");
    }
  );
});

//route to be added in future to edit the article
app.get("/edit/:id", (req, res) => {
  res.send("working on it");
});

//run code
app.post("/run", (req, res) => {
  const reqestUrl = process.env.REQUEST_URL;
  const lang = req.body.language;
  let language;

  if (lang == "cpp") {
    language = "cpp17";
  } else if (lang == "java") {
    language = "java";
  } else if (lang == "javascript") {
    language = "nodejs";
  } else if (lang == "python") {
    language = "python3";
  }

  const program = {
    script: req.body.script,
    language: language,
    versionIndex: "0",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    stdin: req.body.stdinput,
  };

  axios
    .post(reqestUrl, program)
    .then((response) => res.status(200).send(response.data))
    .catch((err) => res.status(200).send(err));
});

/* Listening app */
app.listen(process.env.PORT || 8080, () => {
  console.log("Started .....");
});
