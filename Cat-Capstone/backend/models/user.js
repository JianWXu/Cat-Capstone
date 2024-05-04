"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // Try to sign in the user using Supabase
    const { user, error } = await db.auth.signIn({
      email: username,
      password: password
    });
  
    if (error) {
      throw new UnauthorizedError("Invalid username/password");
    }
  
    if (user) {
      // If sign in successful, return user details
      const { email, user_metadata } = user;
      const { first_name, last_name, is_admin } = user_metadata;
  
      return {
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
        is_admin: is_admin
      };
    }
  
    throw new UnauthorizedError("Invalid username/password");
  }

  static async register({
    username,
    password,
    first_name,
    last_name,
    email,
    isAdmin,
  }) {
    // Check if the username already exists
    const { data: existingUser, error } = await db
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
  
    if (error) {
      throw new Error(`Error checking duplicate username: ${error.message}`);
    }
  
    if (existingUser) {
      throw new Error(`Duplicate username: ${username}`);
    }
  
    // Register the user with Supabase
    const { user, session, error: registrationError } = await db.auth.signUp({
      email,
      password,
    });
  
    if (registrationError) {
      throw new Error(`Error registering user: ${registrationError.message}`);
    }
  
    // Store additional user information in Supabase metadata
    const { user_metadata, error: metadataError } = await db
      .from('users')
      .upsert(
        {
          username
          first_name,
          last_name,
          is_admin: isAdmin,
        },
        { onConflict: ['username'] }
      );
  
    if (metadataError) {
      throw new Error(`Error storing user metadata: ${metadataError.message}`);
    }
  
    // Return user details
    return {
      username: username,
      first_name: first_name,
      last_name: last_name,
      email: email,
      isAdmin: isAdmin,
    };
  }
  

  // static async get(username) {
  //   const userRes = await db.query(
  //     `SELECT username,
  //                 first_name AS "firstName",
  //                 last_name AS "lastName",
  //                 email
  //          FROM users
  //          WHERE username = $1`,
  //     [username]
  //   );

  //   const user = userRes.rows[0];

  //   if (!user) throw new NotFoundError(`No user: ${username}`);

  //   const catsOwned = await db.query(
  //     `SELECT id
  //          FROM cats
  //          WHERE user = $1`,
  //     [username]
  //   );

  //   if (catsOwned) {
  //     user.cats = catsOwned.rows.map(c => c.cat_id);
  //   }

  //   return user;
  // }

  static async get(username) {
    // Fetch user data
    const { data: users, error } = await db
      .from("users")
      .select("username, first_name, last_name, email")
      .eq("username", username)
      .single();

    if (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }

    if (!users) {
      throw new NotFoundError(`No user: ${username}`);
    }

    const user = users;

    // Fetch cats owned by the user
    const { data: catsOwned, error: catsError } = await db
      .from("cats")
      .select("id")
      .eq("username", username);

    if (catsError) {
      throw new Error(
        `Error fetching cats owned by user: ${catsError.message}`
      );
    }

    if (catsOwned) {
      user.cats = catsOwned.map(cat => cat.id);
    }

    return user;
  }

  // static async update(username, data) {
  //   if (data.password) {
  //     data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
  //   }

  //   const { setCols, values } = sqlForPartialUpdate(data, {
  //     username: "username",
  //     firstName: "first_name",
  //     lastName: "last_name",
  //   });
  //   const usernameVarIdx = "$" + (values.length + 1);

  //   const querySql = `UPDATE users 
  //                     SET ${setCols} 
  //                     WHERE username = ${usernameVarIdx} 
  //                     RETURNING username,
  //                               first_name AS "firstName",
  //                               last_name AS "lastName",
  //                               email`;
  //   const result = await db.query(querySql, [...values, username]);
  //   const user = result.rows[0];

  //   if (!user) throw new NotFoundError(`No user: ${username}`);

  //   delete user.password;
  //   return user;
  // }



  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }
  
    const { username: _, ...updateData } = data; // Exclude username from update data
  
    // Update the user in Supabase
    const { error: updateError } = await db
      .from('users')
      .update(updateData)
      .match({ username });
  
    if (updateError) {
      throw new Error(`Error updating user: ${updateError.message}`);
    }
  
    // Fetch the updated user
    const { data: user, error: fetchError } = await db
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
  
    if (fetchError) {
      throw new Error(`Error fetching updated user: ${fetchError.message}`);
    }
  
    if (!user) {
      throw new NotFoundError(`No user: ${username}`);
    }
  
    // Omit the password field before returning the user
    delete user.password;
    return user;
  }

  static async remove(username) {
    const { error } = await db
        .from('users')
        .delete()
        .match({ username: username });

    if (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
}

}

module.exports = User;
