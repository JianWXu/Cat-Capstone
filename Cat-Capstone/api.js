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
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getUser(username) {
    try {
      let res = await this.request(`user/${username}`);
      return res;
    } catch (err) {
      console.err("Error fidning user", err);
    }
  }

  static async verifyUserSignIn(data) {
    let { username, password } = data;
    try {
      let res = await this.request(
        `/auth/token`,
        { usename, password },
        "post"
      );
      console.log(res.token);
      CatApi.token = res.token;
      localStorage.setItem("userToken", res.token);
      return res.token;
    } catch (err) {
      console.error("Error logging in:", err);
      throw err;
    }
  }

  static async makeUser(info) {
    let { username, password, firstName, lastName, email } = info;
    try {
      let res = await this.request(
        `auth/register`,
        { username, password, firstName, lastName, email },
        "post"
      );

      return res;
    } catch (err) {
      console.error("Error registering user:", err);
      throw err;
    }
  }
}

export default CatApi;
