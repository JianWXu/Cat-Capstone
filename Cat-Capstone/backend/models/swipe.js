"user strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

/** Relate functions for user's swipes */

class Swipe {
  static async addSwipe(username, cat_id, liked = false) {
    try {
      console.log(
        `Attempting to add swipe with username: ${username}, cat_id: ${cat_id}, liked: ${liked}`
      );
      const { data, error } = await db
        .from("swipes")
        .insert([{ username, cat_id, liked }]);

      console.log("Database Response:", { data, error }); // Log the full response

      if (error) {
        console.error(`Error adding swipe: ${error.message}`);
        throw new Error(`Error adding swipe: ${error.message}`);
      }

      return;
    } catch (err) {
      console.error("Error in addSwipe method:", err);
      throw err;
    }
  }
}

module.exports = Swipe;
