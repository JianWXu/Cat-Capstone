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
    try {
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

      if (catError) {
        if (catError.code === "PGRST116") {
          // Code for "row not found"
          throw new Error(`No cat found with id: ${id}`);
        }
        console.error("Error fetching cat:", catError);
        throw new Error("Error fetching cat");
      }

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
    } catch (err) {
      console.error("Error in get:", err);
      throw new Error("Error getting cat");
    }
  }

  static async getUserCats(username) {
    try {
      const { data: catData, error: findCatError } = await db
        .from("cats")
        .select("*") // Select all fields for each cat
        .eq("username", username);
  
      if (findCatError) {
        throw new Error(`Error finding cats for username ${username}: ${findCatError.message}`);
      }
  
      return catData; // Return all cats associated with the username
    } catch (err) {
      console.error("Error fetching user's cats:", err);
      throw new Error("Failed to fetch user's cats");
    }
  }
  

  static async getRandomCat(username) {
    try {
      // Get the total number of rows in the cats table
      const { data: catData, error: catError } = await db
        .from("cats")
        .select("id", { count: "exact", head: true });

      if (catError) {
        console.error(catError);
        throw new Error("Error fetching total number of cats");
      }

      if (!catData || !catData.count) {
        throw new Error("No cats found in the database");
      }

      const totalCats = catData.count;
      if (totalCats === 0) throw new Error("No cats available");

      // Fetch swiped cat IDs for the user
      const { data: swipedData, error: swipedError } = await db
        .from("swipes")
        .select("cat_id")
        .eq("username", username);

      if (swipedError) {
        console.error(swipedError);
        throw new Error("Error fetching swiped cats");
      }

      const swipedCatIds = swipedData.map(swipe => swipe.cat_id);
      let randomCatId;

      // Ensure that there are cats that the user hasn't swiped
      if (swipedCatIds.length >= totalCats) {
        throw new Error("No more cats to swipe");
      }

      // Generate random cat ID and check if it's not in swipedCatIds
      do {
        randomCatId = Math.floor(Math.random() * totalCats) + 1;
      } while (swipedCatIds.includes(randomCatId));

      if (!randomCatId) {
        throw new Error("Failed to generate a random cat ID");
      }

      return randomCatId;
    } catch (err) {
      console.error("Error in getRandomCat:", err);
      throw new Error("Error getting random cat");
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
