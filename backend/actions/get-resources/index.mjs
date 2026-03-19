import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        let allItems = [];
        let lastEvaluatedKey = null;

        // Keep fetching as long as there is a "LastEvaluatedKey"
        do {
            const command = new QueryCommand({
                TableName: "Resource",
                KeyConditionExpression: "pk = :pk",
                ExpressionAttributeValues: {
                    ":pk": "RESOURCE",
                },
                // Pass the key from the previous request to get the next page
                ExclusiveStartKey: lastEvaluatedKey || undefined,
            });

            const result = await docClient.send(command);
            
            if (result.Items) {
                allItems.push(...result.Items);
            }

            // Update the key for the next iteration
            lastEvaluatedKey = result.LastEvaluatedKey;

        } while (lastEvaluatedKey); 

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
                data: allItems,
                count: allItems.length // Helpful for debugging
            }),
        };
    } catch (error) {
        console.error("getAllResources error:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                error: { message: "Internal Server Error" },
            }),
        };
    }
};