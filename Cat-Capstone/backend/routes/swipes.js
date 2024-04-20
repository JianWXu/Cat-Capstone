"use strict";

const User = require("../models/user");
const Cat = require("../models/cat");
const express = require("express");
const router = new express.Router();
const { BadRequestError, NotFoundError } = require("../expressError");

//route for grabbing a random cat with an id that isn't yet on the swipe db table connected with current user
router.post("/:randomId", async function (req, res, next) {
  try {
    const userId = req.userId;
    const randomCatId = await Cat.getRandomCat(userId);

    const catRes = await Cat.get(randomCatId);
    if (!catRes) throw NotFoundError(`No cat found`);

    return catRes;
  } catch (err) {
    return next(err);
  }
});
