import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
	try {
		const pk = "RESOURCE"
		const { sk } = event.pathParameters || {};
		if (!sk) {
			return {
				statusCode: 400,
				headers: {
					"Access-Control-Allow-Origin": "*", // Required for CORS support to work
					"Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
				},
				body: JSON.stringify({
					error: {
						code: "VALIDATION_ERROR",
						message: "sk is required in the path",
					},
				}),
			};
		}

		const command = {
			TableName: "Resource",
			Key: {
				pk: pk,
				sk: sk,
			},
			ConditionExpression:
				"attribute_exists(pk) AND attribute_exists(sk)", // ensures the item exists
		};

		await docClient.send(new DeleteCommand(command));

		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*", // Required for CORS support to work
				"Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
			},
			body: JSON.stringify({
				data: {
					pk,
					sk,
					message: "Resource successfully deleted",
				},
			}),
		};
	} catch (error) {
		console.error("deleteResource error:", error);

		return {
			statusCode: 500,
			headers: {
				"Access-Control-Allow-Origin": "*", // Required for CORS support to work
				"Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
			},
			body: JSON.stringify({
				error: {
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong while deleting the resource",
				},
			}),
		};
	}
};
