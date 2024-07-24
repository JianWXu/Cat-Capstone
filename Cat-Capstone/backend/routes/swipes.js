"use strict";

const User = require("../models/user");
const Cat = require("../models/cat");
const Swipe = require("../models/swipe");
const { ensureLoggedIn } = require("../middleware/auth");
const express = require("express");
const router = new express.Router();
const { BadRequestError, NotFoundError } = require("../expressError");

//route for grabbing a random cat with an id that isn't yet on the swipe db table connected with current user

router.get("/random", ensureLoggedIn, async function (req, res, next) {
  try {
    const username = res.locals.user.username;

    if (!username) {
      throw new Error("Username is required");
    }

    const cat = await Cat.getRandomCat(username);

    if (!cat) {
      throw new Error("No valid random cat found");
    }

    return res.json({ cat });
  } catch (err) {
    console.error("Error fetching random cat:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { username, cat_id, liked } = req.body;
    console.log(`Received request body: ${JSON.stringify(req.body)}`); // Log the entire request body
    console.log(
      `Received cat_id: ${cat_id} with ${username} whose liking for cat is ${liked}`
    ); // Log the received cat_id
    const swipeRes = await Swipe.addSwipe(username, cat_id, liked);

    if (!swipeRes) throw new Error("Error inserting swipe");
    console.log("router post response is", swipeRes);
    return res.status(201).json({ swipe: swipeRes });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
