const contentful = require("contentful");
const { createClient } = contentful;

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_KEY,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

module.exports = client;
