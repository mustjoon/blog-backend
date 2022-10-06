"use strict";
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const createComment = async (event) => {
  const body = JSON.parse(Buffer.from(event.body, "base64").toString());
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  // ToDo: research if these are needed to validate etc or if dynamo does some black magic
  const putParams = {
    TableName: process.env.DYNAMODB_COMMENT_TABLE,
    Item: {
      primary_key: uuidv4(),
      comment: body.comment,
      blog_id: body.blogId,
    },
  };
  await dynamoDb.put(putParams).promise();

  return {
    statusCode: 201,
  };
};

const getCommentsByBlog = async (event) => {
  const querystring = event.queryStringParameters;
  const blogId = querystring?.blogId;

  if (!blogId) {
    return {
      statusCode: 422,
    };
  }

  try {
    // ToDo: research if these are needed to validate etc or if dynamo does some black magic
    const scanParams = {
      TableName: process.env.DYNAMODB_COMMENT_TABLE,
      FilterExpression: "#blog = :blog",
      ExpressionAttributeNames: {
        "#blog": "blog_id",
      },
      ExpressionAttributeValues: {
        ":blog": blogId,
      },
    };

    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const result = await dynamodb.scan(scanParams).promise();

    if (result.Count === 0) {
      return {
        statusCode: 200,
        body: {
          total: 0,
          items: [],
        },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        total: result.Count,
        items: await result.Items.map((comment) => {
          return {
            comment: comment.comment,
            blog_id: comment.blog_id,
          };
        }),
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err),
    };
  }
};

module.exports = {
  createComment,
  getCommentsByBlog,
};
