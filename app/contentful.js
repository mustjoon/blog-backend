"use strict";
const client = require("./helpers/contentful-client");

const getAllBlogs = async (event) => {
  try {
    const data = await client.getEntries({ content_type: "blogPost" });

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
    };
  }
};

const getSingleBlog = async (event) => {
  console.log(process.env.custom);
  const blogId = event.pathParameters?.id;

  if (!blogId) {
    return {
      statusCode: 422,
    };
  }

  try {
    const data = await client.getEntry(blogId);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
    };
  }
};

module.exports = {
  getAllBlogs,
  getSingleBlog,
};
