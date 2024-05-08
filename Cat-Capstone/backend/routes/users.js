"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const db = require("../db");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
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

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin}
 *
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get(
  "/:username",
  // ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch(
  "/:username",
  // ensureCorrectUserOrAdmin,
  async function (req, res, next) {
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
  }
);

router.patch(
  "/:username/cats/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, catUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
      const user = User.get(req.params.user);
      if (!user) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }

      const cat = await Cat.update(req.params.id, req.body);
      return res.json({ cat });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete(
  "/:username",
  // ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

/** POST /[username]/cats/[id]
 *
 * Returns {"added": catId}
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.post(
  "/:username/cats/:id",
  upload.single("image"),
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    const catImage = req.image;
    console.log("uploaded cat image", catImage);
    const catImageFile = catImage.file;

    try {
      const catId = +req.params.id;

      const picture_id = await Picture.addPicture(catId, {
        ...req.data,
        imageUrl: uploadedImageUrl,
      });
      await Cat.create(req.params.username, catId, picture_id);
      return res.json({ added: catId });
    } catch (err) {
      return next(err);
    }
  }
);

// const uploadToSupabase = async (username, file) => {
//   const bucketName = 'cat_images'
//   const filePath = `${username}/${file.name}`

//   const { error } = await db
//     .storage
//     .from(bucketName)
//     .upload(filePath, file, {
//       cacheControl: '3600',
//       upsert: true
//     })

//     // get the url to the image
//     const { data } = db
//       .storage
//       .from(bucketName)
//       .getPublicUrl(filePath)

//     return data.public_url

module.exports = router;
