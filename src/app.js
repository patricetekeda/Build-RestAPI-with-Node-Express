const express = require("express");
const morgan = require("morgan");
const fs = require("fs/promises");
const cors = require("cors");
const _ = require("lodash");
const { v4: uuid } = require("uuid");

const app = express();

const getOutfitColors = (req, res) => {
  const tops = ["white cocaine", "black", "pink", "grey"];
  const jeans = ["blue", "green", "pink", "white"];
  const shoes = ["white platinum", "black", "blue", "white cocaine"];
  res.json({
    top: _.sample(tops),
    jeans: _.sample(tops),
    shoes: _.sample(tops),
  });
};

const postComments = async (req, res) => {
  const id = uuid();
  const {
    body: { content },
  } = req;

  await fs.mkdir("data/comments", { recursive: true }); // creates a new directory called data and a nested directory called comments
  await fs.writeFile(`data/comments/${id}.txt`, content);

  !content
    ? res.sendStatus(400)
    : res.status(201).json({ id: id, "content-saved": content });
};

const getCommentById = async (req, res) => {
  const {
    params: { id },
  } = req;

  let content;

  try {
    content = (await fs.readFile(`data/comments/${id}.txt`)).toString();
  } catch (error) {
    return res.sendStatus(404);
  }
  res.json({
    content: content,
  });
};

const notFound = (req, res, next) => {
  const { path } = req;
  res.send(`Sorry for the requested url is invalid, ${path} does not exist.`);
};

const generalError = (error, req, res, next) => {
  console.error(error);
  res.send(error);
};

app.use(morgan("dev"));
app.use(express.json());

app.get("/outfits", getOutfitColors);
app.post("/comments", postComments);
app.get("/comments/:id", getCommentById);

app.use(notFound); // handle error when route is not found
app.use(generalError); // handle general errors within our app

module.exports = app;
