"use strict";

const User = require("../models/user");
const Cat = require("../models/cat");
const Swipe = require("../models/swipe");
const express = require("express");
const router = new express.Router();
const { BadRequestError, NotFoundError } = require("../expressError");

//route for grabbing a random cat with an id that isn't yet on the swipe db table connected with current user
router.get("/random", async function (req, res, next) {
  try {
    const { username } = req.query;
    if (!username) {
      throw new Error("Username is required");
    }
    const randomCatId = await Cat.getRandomCat(username);

    if (!randomCatId) {
      throw new Error("No valid random cat ID generated");
    }

    const catRes = await Cat.get(randomCatId);
    if (!catRes) throw NotFoundError(`No cat found`);

    return res.json({ cat: catRes });
  } catch (err) {
    console.error("Error fetching random cat:", err); // Log the error for debugging
    return res.status(500).json({ error: err.message }); // Return a detailed error message to the client
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { username, catId, liked } = req.body;
    const swipeRes = await Swipe.addSwipe(username, catId, liked);

    if (!swipeRes) throw new Error("Error inserting swipe");

    return res.status(201).json({ swipe: swipeRes });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
