import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Resource";
const TRENDING_LIMIT = 3;
const NEW_LIMIT = 3;

export const handler = async (event) => {
  try {
    // Run both queries in parallel
    const [trendingResult, newResult] = await Promise.all([
      getTrending(),
      getNewest()
    ]);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        trending: trendingResult,
        new: newResult
      })
    };
  } catch (error) {
    console.error("Discover error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Internal Server Error" })
    };
  }
};

async function getTrending() {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "SaveCountIndex",
    KeyConditionExpression: "#pk = :pk",
    ExpressionAttributeNames: {
      "#pk": "pk"
    },
    ExpressionAttributeValues: {
      ":pk": "RESOURCE"
    },
    ScanIndexForward: false, // highest saveCount first
    Limit: TRENDING_LIMIT
  };

  const result = await db.send(new QueryCommand(params));
  return sanitize(result.Items);
}

async function getNewest() {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "CreatedAtIndex",
    KeyConditionExpression: "#pk = :pk",
    ExpressionAttributeNames: {
      "#pk": "pk"
    },
    ExpressionAttributeValues: {
      ":pk": "RESOURCE"
    },
    ScanIndexForward: false, // newest first
    Limit: NEW_LIMIT
  };

  const result = await db.send(new QueryCommand(params));
  return sanitize(result.Items);
}

// Remove internal fields before returning to client
function sanitize(items) {
  const privateFields = ["pk", "sk"];

  return items.map(item => {
    const sanitized = { ...item };

    privateFields.forEach(field => {
      delete sanitized[field];
    });

    return sanitized;
  });
}

