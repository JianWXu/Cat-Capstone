"use strict";

/** Routes for cats. */

const jsonschema = require("jsonschema");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const express = require("express");
const { BadRequestError } = require("../expressError");
const Cat = require("../models/cat");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const catSearchSchema = require("../schemas/catSearchSchema.json");

const router = express.Router();

/** GET / => { cats: [ {name, user, picture, breed } ] }
 *
 * Returns list of all cats.
 *
 * Authorization required: admin
 **/

router.get("/", ensureCorrectUserOrAdmin, async function (req, res, next) {
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

router.get("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const cat = await Cat.get(req.params.id);
    if (!cat) {
      throw new BadRequestError(`No such cat id: ${req.params.id}`);
    }
    return res.json({ cat });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
