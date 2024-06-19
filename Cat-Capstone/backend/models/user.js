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
   * Returns { username, first_name, last_name, email }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate({ email, password }) {
    // Try to sign in the user using Supabase

    const { data, error } = await db.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedError("Invalid username/password");
    }

    // Check if user object exists
    if (!data || !data.user) {
      throw new UnauthorizedError("User data is missing");
    }

    const { user } = data;

    // Access user metadata directly
    const { email: userEmail, user_metadata } = user;

    if (!user_metadata) {
      throw new UnauthorizedError("User metadata is missing");
    }

    const { username, first_name, last_name } = user_metadata;

    return {
      username: username || "",
      first_name: first_name || "",
      last_name: last_name || "",
      email: userEmail || "",
    };
  }

  static async register({ username, password, first_name, last_name, email }) {
    try {
      // Check if the username already exists
      const { data: existingUser, error: usernameCheckError } = await db
        .from("users")
        .select("username")
        .eq("username", username)
        .limit(1);

      if (usernameCheckError) {
        throw new Error(
          `Error checking duplicate username: ${usernameCheckError.message}`
        );
      }

      if (existingUser.length > 0) {
        throw new Error(`Duplicate username: ${username}`);
      }

      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

      // Register the user with Supabase
      const {
        user,
        session,
        error: registrationError,
      } = await db.auth.signUp({
        email,
        password,
      });

      if (registrationError) {
        throw new Error(`Error registering user: ${registrationError.message}`);
      }

      // Store additional user information in Supabase metadata
      const { user_metadata, error: metadataError } = await db
        .from("users")
        .upsert(
          {
            username,
            password: hashedPassword, // Store hashed password
            email,
            first_name,
            last_name,
          },
          { onConflict: ["username"] }
        );
      console.log("User metadata:", user_metadata);
      console.log("Metadata error:", metadataError);

      if (metadataError) {
        throw new Error(
          `Error storing user metadata: ${metadataError.message}`
        );
      }

      // Return user details
      return {
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
      };
    } catch (error) {
      console.error("Registration Error:", error.message);
      throw error;
    }
  }

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

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { username: _, ...updateData } = data; // Exclude username from update data

    // Update the user in Supabase
    const { error: updateError } = await db
      .from("users")
      .update(updateData)
      .match({ username });

    if (updateError) {
      throw new Error(`Error updating user: ${updateError.message}`);
    }

    // Fetch the updated user
    const { data: user, error: fetchError } = await db
      .from("users")
      .select("*")
      .eq("username", username)
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

  static async logout() {
    const { error } = await db.auth.signOut();
    if (error) {
      throw new Error(`Error logging out: ${error.message}`);
    }
    return "Logged out successfully";
  }

  static async remove(username) {
    const { error } = await db
      .from("users")
      .delete()
      .match({ username: username });

    if (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}

module.exports = User;
