"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Picture {
  static async addPicture(catId, imageData) {
    const bucketName = "cat_images";
    // console.log(imageData);
    const { title = "", description = "", catImage } = imageData;
    // console.log("image data", imageData);
    const filePath = `${catId}/${catImage.originalname}`;

    console.log("file path", filePath);
    console.log("image file", catImage);

    // Upload image to Supabase Storage
    const { data: file, error } = await db.storage
      .from(bucketName)
      .upload(filePath, catImage.buffer, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });

    console.log("file", file);
    console.log("error", error);

    if (error) {
      throw new Error(`Error uploading picture: ${error.message}`);
    }

    const { data } = db.storage.from(bucketName).getPublicUrl(filePath);

    console.log(data);

    // Get URL of uploaded image
    const imageUrl = data.publicUrl;

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

  static async updatePicture(pictureId, pictureData, imageFile) {
    const bucketName = "cat_images";
    const { title = "", description = "", upload_date } = pictureData;

    // Check if the picture exists
    const { data: existingPicture, error: findError } = await db
      .from("pictures")
      .select("*")
      .eq("picture_id", pictureId)
      .single();

    if (findError || !existingPicture) {
      throw new NotFoundError(`No picture with ID ${pictureId} found`);
    }

    let updatedImageUrl = existingPicture.image_url;

    if (imageFile) {
      // If an image file is provided, upload the new image
      const filePath = `${existingPicture.cat_id}/${imageFile.originalname}`;
      const { data: file, error: uploadError } = await db.storage
        .from(bucketName)
        .upload(filePath, imageFile.buffer, {
          cacheControl: "3600",
          upsert: true,
          contentType: imageFile.mimetype,
        });

      if (uploadError) {
        throw new Error(`Error uploading picture: ${uploadError.message}`);
      }

      const { data } = db.storage.from(bucketName).getPublicUrl(filePath);
      updatedImageUrl = data.publicUrl;
    }

    // Update picture metadata in the database
    const { data: updatedPicture, error: updateError } = await db
      .from("pictures")
      .update({
        title,
        description,
        image_url: updatedImageUrl,
        upload_date: upload_date || existingPicture.upload_date,
      })
      .eq("picture_id", pictureId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Error updating picture: ${updateError.message}`);
    }

    return updatedPicture;
  }

  static async remove(pictureId) {
    const { error } = await db.from("pictures").delete().eq("id", pictureId);

    if (error) {
      throw new Error(`Error deleting picture: ${error.message}`);
    }
  }
}

module.exports = Picture;
