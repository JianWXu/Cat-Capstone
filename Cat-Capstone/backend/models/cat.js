"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

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
    let query = `SELECT c.id,
                        c.name,
                        c.username,
                        c.picture_id AS cat_picture_id,
                        c.breed,
                        c.age,
                        c.outdoor,
                        c.friendly,
                        p.picture_id AS picture_picture_id,
                        p.title,
                        p.description,
                        p.file_name,
                        p.file_path,
                        p.upload_date                        
                FROM cats c
                LEFT JOIN pictures p ON c.picture_id = p.picture_id`;
    let whereExpressions = [];
    let queryValues = [];

    if (breed !== undefined) {
      queryValues.push(`%${breed}%`);
      whereExpressions.push(`breed ILIKE $${queryValues.length}`);
    }

    if (age !== undefined) {
      whereExpressions.push(`age=${age}`);
    }
    if (friendly !== undefined) {
      whereExpressions.push(`friendly=${friendly}`);
    }

    // Finalize query and return results

    query += " ORDER BY id";
    const catRes = await db.query(query, queryValues);

    // Grouping cats by their id and attaching pictures to each cat
    const catsWithPictures = {};
    catRes.rows.forEach(cat => {
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

      if (cat.picture_picture_id) {
        catsWithPictures[cat.id].pictures.push({
          picture_id: cat.picture_picture_id,
          title: cat.title,
          description: cat.description,
          file_name: cat.file_name,
          file_path: cat.file_path,
          upload_date: cat.upload_date,
        });
      }
    });

    return Object.values(catsWithPictures);
  }

  static async get(id) {
    const catRes = await db.query(
      `SELECT c.id,
              c.name,
              c.username,
              c.picture_id AS cat_picture_id,
              c.breed,
              c.age,
              c.outdoor,
              c.friendly,
              p.picture_id AS picture_picture_id,
              p.title,
              p.description,
              p.file_name,
              p.file_path,
              p.upload_date
      FROM cats c
      LEFT JOIN pictures p ON c.picture_id = p.picture_id
      WHERE c.id=$1`,
      [id]
    );

    if (catRes.rows.length === 0) {
      throw new NotFoundError(`No cat found with id: ${id}`);
    }

    // Grouping pictures by their picture_id
    const cat = {
      id: catRes.rows[0].id,
      name: catRes.rows[0].name,
      username: catRes.rows[0].username,
      breed: catRes.rows[0].breed,
      age: catRes.rows[0].age,
      outdoor: catRes.rows[0].outdoor,
      friendly: catRes.rows[0].friendly,
      pictures: [],
    };

    catRes.rows.forEach(row => {
      if (row.picture_picture_id) {
        cat.pictures.push({
          picture_id: row.picture_picture_id,
          title: row.title,
          description: row.description,
          file_name: row.file_name,
          file_path: row.file_path,
          upload_date: row.upload_date,
        });
      }
    });

    return cat;
  }

  static async getRandomCat(userId) {
    //get total number of rows in cat table
    const catRows = await db.query(`SELECT COUNT *  AS totalCats FROM cats`);
    const totalCats = catRows[0].totalCats;

    //loop til I find a unique catId that's not in Swiped table connected to the user
    while (true) {
      const randomCatId = Math.floor(Math.random() * totalCats) + 1;

      const swipeRows = await db.query(
        `
        SELECT * FROM swipes WHERE userId=$1 AND catId=$2`,
        [userId, randomCatId]
      );

      //if the catId doesn't exist in the swipes table for the current user, return it
      if (swipesRows.length === 0) {
        return randomCatId;
      }
    }
  }

  static async update(id, data) {
    // Separate the picture data from the other data
    const { picture, ...catData } = data;

    // Build the SET clause for updating cat data
    const { setCols, values } = sqlForPartialUpdate(catData, {});

    // If there's picture data, handle it separately
    let pictureId = null;
    if (picture) {
      // Check if the picture exists
      const existingPictureRes = await db.query(
        `SELECT picture_id FROM pictures WHERE picture_id = $1`,
        [picture.picture_id]
      );

      if (existingPictureRes.rows.length === 0) {
        // If the picture doesn't exist, insert it into the pictures table
        const insertPictureRes = await db.query(
          `INSERT INTO pictures (title, description, file_name, file_path) 
                 VALUES ($1, $2, $3, $4) 
                 RETURNING picture_id`,
          [
            picture.title,
            picture.description,
            picture.file_name,
            picture.file_path,
          ]
        );
        pictureId = insertPictureRes.rows[0].picture_id;
      } else {
        // If the picture already exists, use its picture_id
        pictureId = picture.picture_id;
      }
    }

    // Include picture_id in the update query
    setCols.push("picture_id=$" + (values.length + 1));
    values.push(pictureId);

    // Build the update query
    const idVarIdx = "$" + (values.length + 1);
    const querySql = `UPDATE cats
                      SET ${setCols}
                      WHERE id=${idVarIdx}
                      RETURNING id, name, username, picture_id, breed, age, outdoor, friendly`;

    // Execute the update query
    const result = await db.query(querySql, [...values, id]);
    const cat = result.rows[0];

    // Throw an error if the cat doesn't exist
    if (!cat) {
      throw new NotFoundError(`No cat: ${id}`);
    }

    // Return the updated cat
    return cat;
  }

  //Deletes cat with matching id from database
  // Retrieve and remove the picture IDs associated with the cat

  static async remove(id) {
    const picturesResult = await db.query(
      `SELECT picture_id
       FROM cats
       WHERE id=$1`,
      [id]
    );

    const catPictures = picturesResult.rows;

    const result = await db.query(
      `DELETE FROM cats
       WHERE id=$1
       RETURNING *`,
      [id]
    );

    const cat = result.rows[0];

    if (!cat) {
      throw new NotFoundError(`No cat: ${id}`);
    }

    for (const pic of catPictures) {
      await db.query(
        `DELETE FROM pictures
             WHERE picture_id = $1`,
        [pic.picture_id]
      );
    }
  }
}

module.exports = Cat;
