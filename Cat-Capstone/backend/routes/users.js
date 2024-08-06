"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const express = require("express");
const db = require("../db");
const multer = require("multer");
const upload = multer();
const bodyParser = require("body-parser");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Cat = require("../models/cat");
const Picture = require("../models/picture");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNewSchema.json");
const userUpdateSchema = require("../schemas/userUpdateSchema.json");
const catNewSchema = require("../schemas/catNewSchema.json");
const catUpdateSchema = require("../schemas/catUpdateSchema.json");

const router = express.Router();

// Add body-parser middleware to parse JSON and URL-encoded bodies
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin}
 *
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:username", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.patch(
  "/:username/cats/:id",
  ensureCorrectUser,
  upload.single("image"),
  async function (req, res, next) {
    try {
      const { id } = req.params;
      const catData = req.body;
      const imageFile = req.file;

      const updatedCat = await Cat.updateCat(id, {
        ...catData,
        imageFile,
      });

      res.json({ cat: updatedCat }); // Ensure the response includes 'cat'
    } catch (err) {
      next(err);
    }
  }
);

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

/** POST /[username]/cats/[id]
 *
 * Returns {"added": catId}
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.get(
  "/:username/usercats",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const catsData = await Cat.getUserCats(req.params.username);
      return res.json({ catsData });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  "/:username/cats/new",
  upload.single("image"),
  async function (req, res, next) {
    try {
      const catImage = req.file;
      const title = req.body.title;
      const description = req.body.description;

      const name = req.body.name;
      const breed = req.body.breed;
      const age = +req.body.age;
      const outdoor = req.body.outdoor;
      const friendly = req.body.friendly;
      console.log("uploaded cat image", catImage);

      const newCatId = await Cat.create(req.params.username, {
        name,
        breed,
        age,
        outdoor,
        friendly,
      });

      // Add the picture to the database
      const picture_id = await Picture.addPicture(newCatId, {
        title,
        description,
        catImage,
      });

      await db
        .from("cats")
        .update({
          picture_id: picture_id,
        })
        .eq("id", newCatId);

      return res.json({ added: newCatId });
    } catch (err) {
      return next(err);
    }
  }
);

router.get(
  "/:username/likedCats",
  ensureCorrectUser,
  async (req, res, next) => {
    try {
      const likedCats = await User.getLikedCats(req.params.username);
      return res.json({ likedCats });
    } catch (err) {
      return next(err);
    }
  }
);

router.get(
  "/:username/checkMutualLike",
  ensureCorrectUser,
  async (req, res, next) => {
    try {
      const result = await User.checkMutualLikes(req.params.username);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
