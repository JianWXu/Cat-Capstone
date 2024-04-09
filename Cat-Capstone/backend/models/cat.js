"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for cats. */

class Cat {
  static async create(data) {
    const result = await db.query(
      `INSERT INTO cats (name, 
                                user,
                                picture,
                                breed,
                                age,
                                outdoor,
                                friendly )
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING id, user, name, breed, age, outdoor, friendly`,
      [
        data.name,
        data.user,
        data.picture,
        data.breed,
        data.age,
        data.outdoor,
        data.friendly,
      ]
    );
    let cat = result.rows[0];

    return cat;
  }

  static async findAll({ breed, age, friendly } = {}) {
    let query = `SELECT id,
                        name,
                        user,
                        picture,
                        breed,
                        age,
                        outdoor,
                        friendly                        
                FROM cats`;
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
    return catRes.rows;
  }

  static async get(id) {
    const catRes = await db.query(
      `SELECT id,
            name,
            user,
            picture,
            breed,
            age,
            outdoor,
            friendly
            FROM cats
            WHERE id=$1`,
      [id]
    );

    const cat = catRes.rows[0];

    if (!catRes) throw new NotFoundError(`No cat: ${id}`);

    return catRes;
  }
}
