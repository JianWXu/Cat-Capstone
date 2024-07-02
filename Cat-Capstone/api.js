import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

let BASE_URL = "http://localhost:3001";

class CatApi {
  static get token() {
    return localStorage.getItem("userToken");
  }

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const token = CatApi.token || ""; // Default to empty string if token is null or undefined
    const headers = {
      Authorization: `Bearer ${token.replace(/^"(.*)"$/, "$1")}`,
    };
    const params = method === "get" ? data : {};

    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (err) {
      console.error("API Error:", err);
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

  static async patchCat(info) {
    try {
      let { username, id, name, breed, age, outdoor, friendly, picture } = info;
    } catch (err) {
      throw err;
    }
  }

  static async getRandomCat(username) {
    try {
      // GET request to fetch a random cat
      let res = await this.request(
        `swipe/random?username=${username}`,
        null,
        "get"
      );
      console.log(res);
      return res.cat;
    } catch (err) {
      throw err;
    }
  }

  static async swipeRandomCat(data) {
    try {
      let res = await this.request(`swipe`, { username, catId, liked }, "post");
      return res;
    } catch (err) {
      console.error("Swipe Error:", err);
      throw err;
    }
  }
}
export default CatApi;
