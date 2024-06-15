"use strict";

const User = require("../models/user");
const Cat = require("../models/cat");
const Swipe = require("../models/swipe");
const express = require("express");
const router = new express.Router();
const { BadRequestError, NotFoundError } = require("../expressError");

//route for grabbing a random cat with an id that isn't yet on the swipe db table connected with current user
router.get("/", async function (req, res, next) {
  try {
    const username = req.username;
    const randomCatId = await Cat.getRandomCat(username);

    const catRes = await Cat.get(randomCatId);
    if (!catRes) throw NotFoundError(`No cat found`);

    return res.json({ cat: catRes })
  } catch (err) {
    return next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { username, catId, liked } = req.body;
    const swipeRes = await Swipe.addSwipe(username, catId, liked);

    if (!swipeRes) throw new Error('Error inserting swipe');

    return res.status(201).json({ swipe: swipeRes });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
