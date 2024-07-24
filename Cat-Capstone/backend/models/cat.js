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

  static async getRandomCat(username) {
    try {
      // Get all cat IDs
      const { data: allCatsData, error: allCatsError } = await db
        .from("cats")
        .select("id");

      if (allCatsError) {
        throw new Error("Error fetching all cat IDs");
      }

      const allCatIds = allCatsData.map(cat => cat.id);

      if (allCatIds.length === 0) {
        throw new Error("No cats available");
      }

      // Fetch swiped cat IDs for the user
      const { data: swipedData, error: swipedError } = await db
        .from("swipes")
        .select("cat_id")
        .eq("username", username);

      if (swipedError) {
        throw new Error("Error fetching swiped cats");
      }

      const swipedCatIds = swipedData.map(swipe => swipe.cat_id);

      // Filter out the swiped cat IDs
      const availableCatIds = allCatIds.filter(
        id => !swipedCatIds.includes(id)
      );

      if (availableCatIds.length === 0) {
        throw new Error("No more cats to swipe");
      }

      // Select a random cat ID from the available ones
      const randomCatId =
        availableCatIds[Math.floor(Math.random() * availableCatIds.length)];

      console.log("randomCatId:", randomCatId);

      // Fetch cat details including pictures
      const { data: catDetail, error: detailError } = await db
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
          picture_id,
          pictures!fk_picture_id (
            image_url,
            title,
            description
          )
        `
        )
        .eq("id", randomCatId)
        .single();

      if (detailError) {
        throw new Error("Error fetching cat details");
      }

      return catDetail;
    } catch (err) {
      console.error("Error in getRandomCat:", err);
      throw new Error("Error getting random cat");
    }
  }

  static async getUserCats(username) {
    try {
      // Step 1: Fetch cats data
      const { data: catsData, error: catsError } = await db
        .from("cats")
        .select("*")
        .eq("username", username);

      if (catsError) {
        console.error("Error fetching cats:", catsError.message);
        throw new Error("Failed to fetch cats");
      }

      // Step 2: Fetch pictures data for each cat
      const catsWithPictures = await Promise.all(
        catsData.map(async cat => {
          try {
            const { data: picturesData, error: picturesError } = await db
              .from("pictures")
              .select("*")
              .eq("cat_id", cat.id);

            if (picturesError) {
              console.error(
                `Error fetching pictures for cat ${cat.id}:`,
                picturesError.message
              );
              throw new Error(`Failed to fetch pictures for cat ${cat.id}`);
            }

            // Map pictures data to include only necessary fields
            const pictures = picturesData.map(picture => ({
              picture_id: picture.picture_id,
              cat_id: picture.cat_id,
              title: picture.title,
              image_url: picture.image_url,
              upload_date: picture.upload_date,
            }));

            return {
              id: cat.id,
              name: cat.name,
              username: cat.username,
              breed: cat.breed,
              age: cat.age,
              outdoor: cat.outdoor,
              friendly: cat.friendly,
              pictures: pictures,
            };
          } catch (error) {
            console.error(
              `Error fetching pictures for cat ${cat.id}:`,
              error.message
            );
            return null; // Handle error or return empty array/object as needed
          }
        })
      );

      return catsWithPictures.filter(cat => cat !== null); // Filter out any null values
    } catch (error) {
      console.error("Error fetching user's cats:", error.message);
      throw new Error("Failed to fetch user's cats");
    }
  }

  static async getCatDetail(catId, username) {
    try {
      let { data, error } = await db
        .from("cats")
        .select(
          `
        id,
        name,
        username,
        picture_id,
        breed,
        age,
        outdoor,
        friendly,
         pictures!fk_picture_id ( 
            title,
            description,
            image_url
          )
      `
        )
        .eq("id", catId)
        .eq("username", username)
        .single();

      if (error) {
        throw error;
      }

      if (!data || data.username !== username) {
        throw new UnauthorizedError();
      }

      console.log("data from cat model get detail", data);

      return data;
    } catch (error) {
      console.error("Error fetching cat details:", error);
      throw new Error("Could not fetch cat details");
    }
  }

  static async updateCat(catId, data) {
    const { picture, imageFile, ...catData } = data;

    let pictureId = null;
    if (picture) {
      // Check if the picture already exists for the given cat
      const { data: existingCat, error: catError } = await db
        .from("cats")
        .select("picture_id")
        .eq("id", catId)
        .single();

      if (catError || !existingCat) {
        throw new NotFoundError(`No cat with ID ${catId} found`);
      }

      pictureId = existingCat.picture_id;

      if (pictureId) {
        // Update existing picture
        try {
          await Picture.updatePicture(pictureId, picture, imageFile);
        } catch (updatePictureError) {
          console.error(updatePictureError);
          throw new Error("Error updating picture");
        }
      } else {
        // Insert new picture
        try {
          pictureId = await Picture.addPicture(catId, picture, imageFile);
        } catch (insertPictureError) {
          console.error(insertPictureError);
          throw new Error("Error inserting new picture");
        }
      }
    }

    // Update cat data with the picture_id if available
    const updateData = {
      ...catData,
      picture_id: pictureId,
    };

    const { data: updatedCat, error: updateCatError } = await db
      .from("cats")
      .update(updateData)
      .eq("id", catId)
      .select("id, name, username, picture_id, breed, age, outdoor, friendly")
      .single();

    if (updateCatError) {
      console.error(updateCatError);
      throw new Error("Error updating cat data");
    }

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
