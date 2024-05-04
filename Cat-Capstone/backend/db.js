"use strict";
/** Database setup for cat_cap. */
// const { Client } = require("pg");

require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");
const API_KEY = process.env.API_KEY;
const PROJECT_URL = process.env.PROJECT_URL;

const { getDatabaseUri } = require("./config");

let db;

// if (process.env.NODE_ENV === "production") {
//   db = new Client({
//     // connectionString: getDatabaseUri(),
//     // ssl: {
//     //   rejectUnauthorized: false
//     // }
//   });
// } else {
//   db = new Client({
//     connectionString: getDatabaseUri()
//   });
// }

// db.connect();

db = createClient(PROJECT_URL, API_KEY);

module.exports = db;
