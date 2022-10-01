"use strict";
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const createComment = async (event) => {
  const body = JSON.parse(Buffer.from(event.body, "base64").toString());
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  // ToDo: research if these are needed to validate etc or if dynamo does some black magic
  const putParams = {
    TableName: process.env.DYNAMODB_CUSTOMER_TABLE,
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
  // ToDo: research if these are needed to validate etc or if dynamo does some black magic
  const scanParams = {
    TableName: process.env.DYNAMODB_CUSTOMER_TABLE,
    ExpressionAttributeValues: {
      ":s": { S: blogId },
    },
    FilterExpression: "blogId = :s",
  };

  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const result = await dynamodb.scan(scanParams).promise();

  if (result.Count === 0) {
    return [];
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      total: result.Count,
      items: await result.Items.map((comment) => {
        return {
          comment: comment.customer,
          blog_id: comment.blog_id,
        };
      }),
    }),
  };
};

module.exports = {
  createComment,
  getCommentsByBlog,
};
