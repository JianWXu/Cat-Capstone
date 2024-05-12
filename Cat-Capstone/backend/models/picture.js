"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Picture {
  static async addPicture(catId, imageData) {
    const bucketName = "cat_images";
    const { title = "", description = "", imageFile } = imageData;
    // console.log("image data", imageData);
    const filePath = `/${bucketName}/${catId}/${imageFile.originalname}`;

    console.log("file path", filePath);
    console.log("image file", imageFile);

    // Upload image to Supabase Storage
    const { data: file, error } = await db.storage
      .from(bucketName)
      .upload(filePath, imageFile.buffer, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });

    console.log("file", file);

    if (error) {
      throw new Error(`Error uploading picture: ${error.message}`);
    }

    console.log("error", error);

    const { data } = db.storage.from(bucketName).getPublicUrl(filePath);

    console.log(data)

    // Get URL of uploaded image
    const imageUrl = data.public_url;

    // Insert picture metadata into the database
    const { data: picture, error: insertError } = await db
      .from("pictures")
      .insert([
        {
          cat_id: catId,
          title,
          description,
          image_url: imageUrl,
        },
      ])
      .select();

    if (insertError) {
      throw new Error(`Error adding picture: ${insertError.message}`);
    }

    return picture[0].picture_id;
  }

  static async remove(pictureId) {
    const { error } = await db.from("pictures").delete().eq("id", pictureId);

    if (error) {
      throw new Error(`Error deleting picture: ${error.message}`);
    }
  }
}

module.exports = Picture;
