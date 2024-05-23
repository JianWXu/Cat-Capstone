"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const Picture = require("../models/picture");

/** Related functions for cats. */

class Cat {
  // /** Add a cat, returns undefined.
  //  *
  //  * - username: username adding cat
  //  * - catId: cat id
  //  **/

  static async create(username, catData) {
    try {
      console.log("cat data", catData);

      const { data: catResult, error: catError } = await db
        .from("cats")
        .insert({
          name: catData.name,
          username: username,
          breed: catData.breed,
          age: catData.age,
          outdoor: catData.outdoor,
          friendly: catData.friendly,
        })
        .select();

      console.log("cat error", catError);

      if (catError) {
        throw new Error(`Error inserting cat: ${catError.message}`);
      }

      console.log("cat result from create", catResult);

      // Check if catResult is null or empty
      if (!catResult || catResult.length === 0) {
        throw new Error("Failed to create cat. No result returned.");
      }

      // Extract the cat ID from the inserted data
      const catId = catResult[0].id;

      if (!catId) {
        throw new Error("Failed to retrieve cat ID.");
      }

      return catId;
    } catch (error) {
      throw new Error(`Error creating cat: ${error.message}`);
    }
  }

  static async findAll({ breed, age, friendly } = {}) {
    let query = db.from("cats").select(`
        id,
        name,
        username,
        breed,
        age,
        outdoor,
        friendly,
        pictures:picture_id (
          picture_id,
          cat_id,
          title,
          description,
          image_url,
          upload_date
        )
      `);

    if (breed) {
      query = query.ilike("breed", `%${breed}%`);
    }

    if (age) {
      query = query.eq("age", age);
    }

    if (friendly !== undefined) {
      query = query.eq("friendly", friendly);
    }

    // Execute the query
    const { data: cats, error } = await query;

    if (error) {
      console.error("Error fetching cats:", error);
      throw new Error("Error fetching cats");
    }

    // Grouping cats by their id and attaching pictures to each cat
    const catsWithPictures = {};
    cats.forEach(cat => {
      if (!catsWithPictures[cat.id]) {
        catsWithPictures[cat.id] = {
          id: cat.id,
          name: cat.name,
          username: cat.username,
          breed: cat.breed,
          age: cat.age,
          outdoor: cat.outdoor,
          friendly: cat.friendly,
          pictures: [],
        };
      }

      if (cat.pictures && cat.pictures.length > 0) {
        cat.pictures.forEach(picture => {
          catsWithPictures[cat.id].pictures.push({
            picture_id: picture.picture_id,
            title: picture.title,
            description: picture.description,
            image_url: picture.image_url,
            upload_date: picture.upload_date,
          });
        });
      }
    });

    return Object.values(catsWithPictures);
  }

  static async get(id) {
    const { data: cat, error: catError } = await db
      .from("cats")
      .select(
        `
        id,
        name,
        username,
        breed,
        age,
        outdoor,
        friendly,
        pictures (
          picture_id,
          title,
          description,
          image_url AS file_path,
          upload_date
        )
      `
      )
      .eq("id", id)
      .single();

    // Handle errors
    if (catError) {
      if (catError.code === "PGRST116") {
        // Code for "row not found"
        throw new Error(`No cat found with id: ${id}`);
      }
      console.error("Error fetching cat:", catError);
      throw new Error("Error fetching cat");
    }

    // Process and return the result
    return {
      id: cat.id,
      name: cat.name,
      username: cat.username,
      breed: cat.breed,
      age: cat.age,
      outdoor: cat.outdoor,
      friendly: cat.friendly,
      pictures: cat.pictures || [],
    };
  }

  static async getRandomCat(userId) {
    // Get the total number of rows in the cats table
    const { data: catData, error: catError } = await db
      .from("cats")
      .select("id", { count: "exact", head: true });

    if (catError) {
      console.error(catError);
      throw new Error("Error fetching total number of cats");
    }

    const totalCats = catData.count;

    // Loop until a unique catId is found that's not in the swipes table for the user
    while (true) {
      const randomCatId = Math.floor(Math.random() * totalCats) + 1;

      const { data: swipeData, error: swipeError } = await db
        .from("swipes")
        .select("*")
        .eq("userId", userId)
        .eq("catId", randomCatId);

      if (swipeError) {
        console.error(swipeError);
        throw new Error("Error fetching swipes");
      }

      // If the catId doesn't exist in the swipes table for the current user, return it
      if (swipeData.length === 0) {
        return randomCatId;
      }
    }
  }

  static async updateCat(catId, data) {
    const { picture, ...catData } = data;

    let pictureId = null;
    if (picture) {
      // Check if the picture exists
      const { data: existingPicture, error: pictureCheckError } = await db
        .from("pictures")
        .select("picture_id")
        .eq("picture_id", picture.picture_id)
        .single();

      if (pictureCheckError && pictureCheckError.code !== "PGRST116") {
        // Handle error that is not related to "no rows returned"
        console.error(pictureCheckError);
        throw new Error("Error checking picture existence");
      }

      if (!existingPicture) {
        try {
          pictureId = await PictureModel.addPicture(catId, picture);
        } catch (insertPictureError) {
          console.error(insertPictureError);
          throw new Error("Error inserting new picture");
        }
      } else {
        // If the picture already exists, use its picture_id
        pictureId = existingPicture.picture_id;
      }
    }

    // Update cat data including picture_id if available
    const updateData = {
      ...catData,
      picture_id: pictureId,
    };

    const { data: updatedCat, error: updateCatError } = await db
      .from("cats")
      .update(updateData)
      .eq("id", id)
      .select("id, name, username, picture_id, breed, age, outdoor, friendly")
      .single();

    if (updateCatError) {
      console.error(updateCatError);
      throw new Error("Error updating cat data");
    }

    // Return the updated cat
    return updatedCat;
  }

  //Deletes cat with matching id from database
  // Retrieve and remove the picture IDs associated with the cat

  static async remove(id) {
    // Fetch the picture IDs associated with the cat
    const { data: catPicturesId, error: catPicturesIdError } = await db
      .from("cats")
      .select("picture_id")
      .eq("id", id);

    if (catPicturesIdError) {
      console.error(catPicturesIdError);
      throw new Error("Error fetching cat pictures");
    }

    // Delete the cat
    const { data: deletedCat, error: deleteCatError } = await db
      .from("cats")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    if (deleteCatError) {
      console.error(deleteCatError);
      throw new NotFoundError(`No cat: ${id}`);
    }

    // Delete associated pictures
    for (const pic of catPicturesId) {
      const { error: deletePictureError } = await db
        .from("pictures")
        .delete()
        .eq("picture_id", pic.picture_id);

      if (deletePictureError) {
        console.error(deletePictureError);
        throw new Error(`Error deleting picture with ID: ${pic.picture_id}`);
      }
    }
  }
}

module.exports = Cat;
