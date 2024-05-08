"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Picture {
  static async addPicture(catId, data) {
    const bucketName = "cat_images";
    const { title, description, imageFile } = data;
    const filePath = `${catId}/${imageFile.name}`;

    // Upload image to Supabase Storage
    const { data: file, error } = await db.storage
      .from(bucketName)
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw new Error(`Error uploading picture: ${error.message}`);
    }

    // const { data } = db.storage.from(bucketName).getPublicUrl(filePath);

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
      ]);

    if (insertError) {
      throw new Error(`Error adding picture: ${insertError.message}`);
    }

    return picture[0].pictureId;
  }

  static async remove(pictureId) {
    const { error } = await db.from("pictures").delete().eq("id", pictureId);

    if (error) {
      throw new Error(`Error deleting picture: ${error.message}`);
    }
  }
}

module.exports = Picture;
