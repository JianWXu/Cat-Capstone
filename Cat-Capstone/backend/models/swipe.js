"user strict";

const db = request("../db");
const { NotFoundError } = require("../expressError");

/** Relate functions for user's swipes */

class Swipe {
  static async addSwipe(username, catId, liked = false) {
    // Insert user and cat swiped into swipes table using Supabase client
    const { data, error } = await db
      .from("swipes")
      .insert([{ username, catId, liked }]);

    if (error) {
      throw new Error(`Error adding swipe: ${error.message}`);
    }

    // Return the inserted data
    return data[0];
  }
}

module.exports = Swipe;
