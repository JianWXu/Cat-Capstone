"use strict";

/** Routes for cats. */

const jsonschema = require("jsonschema");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const express = require("express");
const { BadRequestError } = require("../expressError");
const Cat = require("../models/cat");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const catSearchSchema = require("../schemas/catSearchSchema.json");

const router = express.Router();

// Add body-parser middleware to parse JSON and URL-encoded bodies

/** GET / => { cats: [ {name, user, picture, breed } ] }
 *
 * Returns list of all cats.
 *
 **/

router.get("/", ensureCorrectUser, async function (req, res, next) {
  const q = req.query;
  if (q.age !== undefined) q.age = +q.age;

  try {
    const validator = jsonschema.validate(q, catSearchSchema);
    if (!validator.vali) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const cats = await Cat.findAll(q);
    return res.json({ cats });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const username = res.locals.user.username;

    const cat = await Cat.getCatDetail(req.params.id, username);
    console.log(cat);
    if (!cat) {
      throw new BadRequestError(`No such cat id: ${req.params.id}`);
    }
    return res.json({ cat });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
