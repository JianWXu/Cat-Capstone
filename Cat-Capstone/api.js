import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

let BASE_URL = "http://localhost:3001";

class CatApi {
  static token = localStorage.getItem("userToken");

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${CatApi.token}` };
    console.log("headers", headers);
    const params = method === "get" ? data : {};

    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (err) {
      console.error("API Error:", err);
      if (
        err.response &&
        err.response.data &&
        err.response.data.error &&
        err.response.data.error.message
      ) {
        throw err.response.data.error.message;
      } else if (err.message) {
        throw err.message;
      } else {
        throw err;
      }
    }
  }

  static async getUser(username) {
    try {
      let res = await this.request(`user/${username}`);
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
      let res = await this.request(`users/${username}`, data, "patch");
      return res;
    } catch (err) {
      console.error("Error updating user", err);
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
