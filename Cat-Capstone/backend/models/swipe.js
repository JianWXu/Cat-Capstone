"user strict";

const db = request("../db");
const { NotFoundError } = require("../expressError");

/** Relate functions for user's swipes */

class Swipe {
  static async addSwipe(username, catId, liked = false) {
    //Insert user and cat swiped into swipes table
    const swipeRes = await db.query(
      `INSERT INTO swipes (
                username,
                catId,
                liked
            ) VALUES ($1,$2,$3)
            RETURNING username, catId, liked`,
      [username, catId, liked]
    );

    return swipeRes.rows[0];
  }
}

module.exports = Swipe;
