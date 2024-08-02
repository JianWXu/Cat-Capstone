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
    const { email: userEmail } = user;

    const { data: userData, error: userError } = await db
      .from("users")
      .select("username, first_name, last_name")
      .eq("email", userEmail);

    if (userError) {
      throw new NotFoundError("User not found");
    }

    const { username, first_name, last_name } = userData[0];

    if (username && username.length === 0) {
    }

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

  static async getLikedCats(username) {
    // Step 1: Query swipes table to get cat_ids of liked cats
    const { data: likedSwipes, error: likedSwipesError } = await db
      .from("swipes")
      .select("cat_id")
      .eq("username", username)
      .eq("liked", true);

    if (likedSwipesError) {
      throw new NotFoundError("No liked cats found for user.");
    }

    if (likedSwipes.length === 0) {
      return [];
    }

    const likedCatIds = likedSwipes.map(swipe => swipe.cat_id);

    // Step 2: Query cats table to get data of liked cats
    const { data: likedCats, error: likedCatsError } = await db
      .from("cats")
      .select("*")
      .in("id", likedCatIds);

    if (likedCatsError) {
      throw new NotFoundError("Error retrieving liked cats data.");
    }

    // Fetch emails of cat owners
    const userEmails = await Promise.all(
      likedCats.map(async cat => {
        const { data: user, error: userError } = await db
          .from("users")
          .select("email")
          .eq("username", cat.username) // Ensure this is the correct field
          .single();

        if (userError) {
          throw new Error(
            `Error fetching email for user ${cat.username}: ${userError.message}`
          );
        }

        return { catId: cat.id, email: user.email };
      })
    );

    // Step 3: Query pictures table to get pictures for liked cats
    const pictureIds = likedCats.map(cat => cat.picture_id);
    const { data: pictures, error: picturesError } = await db
      .from("pictures")
      .select("picture_id, image_url")
      .in("picture_id", pictureIds);

    if (picturesError) {
      throw new NotFoundError("Error retrieving pictures for liked cats.");
    }

    // Step 4: Combine cat data with pictures and emails
    const catData = likedCats.map(cat => {
      const picture = pictures.find(pic => pic.picture_id === cat.picture_id);
      const userEmail =
        userEmails.find(user => user.catId === cat.id)?.email || null;
      return {
        ...cat,
        image_url: picture ? picture.image_url : null,
        ownerEmail: userEmail,
      };
    });

    return catData;
  }

  static async checkMutualLikes(username) {
    try {
      // Step 1: Get the list of cats liked by the current user
      const likedCats = await this.getLikedCats(username);

      // Extract usernames of users who own these liked cats
      const ownerUsernames = [...new Set(likedCats.map(cat => cat.username))];

      // Step 2: Fetch all cats owned by these users
      const userCatsPromises = ownerUsernames.map(user => this.get(user));
      const userCatsResults = await Promise.all(userCatsPromises);

      // Flatten the list of cats from all users
      const allUserCats = userCatsResults.flatMap(user => user.cats);

      // Extract cat IDs owned by these users
      const userCatIds = new Set(allUserCats);

      // Check if any of the liked cats are also owned by these users
      const mutualLikes = likedCats.some(cat => userCatIds.has(cat.id));

      return mutualLikes;
    } catch (error) {
      console.error("Error checking mutual likes:", error);
      throw new Error("Error checking mutual likes");
    }
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
