import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

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
						message: "sk required in the path",
					},
				}),
			};
		}

		// 2. Prepare DynamoDB GetCommand
		const command = {
			TableName: "Resource",
			Key: {
				pk: pk,
				sk: sk
			},
		};

		// 3. Fetch item from DynamoDB
		const result = await docClient.send(new GetCommand(command));

		// 4. Handle not found
		if (!result.Item) {
			return {
				statusCode: 404,
				headers: {
					"Access-Control-Allow-Origin": "*", // Required for CORS support to work
					"Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
				},
				body: JSON.stringify({
					error: {
						code: "NOT_FOUND",
						message: `Resource with pk=${pk} sk=${sk} does not exist`,
					},
				}),
			};
		}

		// 5. Return success response
		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*", // Required for CORS support to work
				"Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
			},
			body: JSON.stringify({
				data: result.Item,
			}),
		};
	} catch (error) {
		console.error("getResource error:", error);
		return {
			statusCode: 500,
			headers: {
				"Access-Control-Allow-Origin": "*", // Required for CORS support to work
				"Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
			},
			body: JSON.stringify({
				error: {
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong while fetching the resource",
				},
			}),
		};
	}
};
