import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
	try {
		// 1. Extract path parameters (pk and sk)
		const { pk, sk } = event.pathParameters || {};
		if (!pk || !sk) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					error: {
						code: "VALIDATION_ERROR",
						message: "Both pk and sk are required in the path",
					},
				}),
			};
		}

		// 2. Prepare DynamoDB GetCommand
		const command = {
			TableName: "Resource",
			Key: {
				pk: pk,
				sk: sk,
			},
		};

		// 3. Fetch item from DynamoDB
		const result = await docClient.send(new GetCommand(command));

		// 4. Handle not found
		if (!result.Item) {
			return {
				statusCode: 404,
				body: JSON.stringify({
					error: {
						code: "NOT_FOUND",
						message: `Resource with pk=${pk} and sk=${sk} does not exist`,
					},
				}),
			};
		}

		// 5. Return success response
		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				data: result.Item,
			}),
		};
	} catch (error) {
		console.error("getResource error:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: {
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong while fetching the resource",
				},
			}),
		};
	}
};
