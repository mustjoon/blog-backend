"use strict";
const client = require("./helpers/contentful-client");
const {
  handleBlogItem,
  handleBlogList,
} = require("./helpers/contentful-handlers");

const getAllBlogs = async (event) => {
  try {
    const data = await client.getEntries({ content_type: "blogPost" });

    return {
      statusCode: 200,
      body: JSON.stringify(handleBlogList(data)),
    };
  } catch (err) {
    return {
      statusCode: 500,
    };
  }
};

const getSingleBlog = async (event) => {
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
      body: JSON.stringify(handleBlogItem(data)),
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
