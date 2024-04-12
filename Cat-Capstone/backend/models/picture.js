"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    // Define the destination directory where uploaded files will be stored
    next(null, "uploads/");
  },
  filename: function (req, file, next) {
    // Define the filename for the uploaded file
    next(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

class Picture {
  static async addPicture(catId, data) {
    const { title, description } = data;
    const file = req.file;

    const file_name = file.originalname;
    const file_path = file.path; // Path where the file is stored

    const upload_date = new Date(); // Current date and time

    if (!file) {
      throw new NotFoundError("No file uploaded");
    }

    const query = `
        INSERT INTO pictures (
            cat_id, 
            title, 
            description, 
            file_name, 
            file_path, 
            upload_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING picture_id`;

    const result = await db.query(query, [
      catId,
      title,
      description,
      file_name,
      file_path,
      upload_date,
    ]);
    const pictureId = result.rows[0].picture_id;
    return pictureId;
  }

  static async remove(pictureId) {
    const res = await db.query(`DELETE FROM pictures WHERE picture_Id = $1`, [
      pictureId,
    ]);

    if (!res) throw new NotFoundError("Picture not found");
    return;
  }
}

module.exports = Picture;
