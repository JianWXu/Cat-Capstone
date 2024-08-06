import axios from "axios";

const VITE_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

class CatApi {
  static get token() {
    return localStorage.getItem("userToken");
  }

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${VITE_BASE_URL}/${endpoint}`;
    const token = CatApi.token || "";
    const headers = {
      Authorization: `Bearer ${token.replace(/^"(.*)"$/, "$1")}`,
    };

    // Handle parameters and data based on method
    const config = {
      method,
      url,
      headers,
    };

    if (method === "get") {
      config.params = data; // Include parameters in the URL query string for GET requests
    } else {
      config.data = data; // Include data in the request body for POST/PATCH/PUT requests
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (err) {
      console.error(
        "API Error:",
        err.response ? err.response.data : err.message
      );
      throw err; // Ensure errors are properly thrown for better debugging
    }
  }

  static async getUser(username) {
    try {
      const res = await this.request(`user/${username}`);
      console.log("getUser API response:", res);
      return res;
    } catch (err) {
      console.error("Error finding user", err);
    }
  }

  static async verifyUserSignIn(data) {
    let { email, password } = data;
    try {
      let res = await this.request(`auth/login`, { email, password }, "post");
      console.log("api verify user sign in token", res.token);
      return res.token;
    } catch (err) {
      console.error("Error logging in:", err);
      throw err;
    }
  }

  static async makeUser(info) {
    let { username, password, first_name, last_name, email } = info;
    try {
      let res = await this.request(
        `auth/register`,
        { username, password, first_name, last_name, email },
        "post"
      );

      return res;
    } catch (err) {
      console.error("Error registering user:", err);
      throw err;
    }
  }

  static async patchUser(username, data) {
    try {
      let res = await this.request(`user/${username}`, data, "patch");
      return res;
    } catch (err) {
      console.error("Error updating user", err);
      throw err;
    }
  }

  static async getUserCats(username) {
    try {
      let res = await this.request(`user/${username}/usercats`);
      return res.catsData;
    } catch (err) {
      console.error("Error getting cats", err);
      throw err;
    }
  }

  static async getCatDetails(catId) {
    try {
      let res = await this.request(`cats/${catId}`);
      return res.cat;
    } catch (err) {
      console.error("Error getting cat", err);
      throw err;
    }
  }

  static async addCat(username, formData) {
    try {
      const res = await this.request(
        `user/${username}/cats/new`,
        formData,
        "post",
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res;
    } catch (err) {
      console.error("Error adding cat", err);
      throw err;
    }
  }

  static async updateCat(catId, username, formData) {
    try {
      const res = await this.request(
        `user/${username}/cats/${catId}`,
        formData,
        "patch",
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Log the entire response to verify structure
      console.log("API Response:", res);

      if (!res.cat) {
        throw new Error("Response does not contain 'cat' field");
      }

      return res.cat;
    } catch (error) {
      console.error("Error updating cat:", error);
      throw error;
    }
  }

  static async getRandomCat() {
    try {
      const res = await this.request(`swipe/random`, null, "get");
      return res.cat;
    } catch (err) {
      console.error("Error getting random cat", err);
      throw err;
    }
  }

  static async swipeRandomCat(username, catId, liked) {
    try {
      let res = await this.request(
        `swipe`,
        { username, cat_id: catId, liked },
        "post"
      );
      return res;
    } catch (err) {
      console.error("Swipe Error:", err);
      throw err;
    }
  }

  static async getLikedCats(username) {
    try {
      let res = await this.request(`user/${username}/likedCats`, {}, "get");
      console.log(res.likedCats);
      return res.likedCats;
    } catch (err) {
      console.error("Error getting liked cats", err);
      throw err;
    }
  }

  static async getMutualLike(username) {
    try {
      let res = await this.request(
        `user/${username}/checkMutualLike`,
        {},
        "get"
      );
      console.log(res);
      return res;
    } catch (err) {
      console.error("Error checking mutual likes", err);
      throw err;
    }
  }
}
export default CatApi;
