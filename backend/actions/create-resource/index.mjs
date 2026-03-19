import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
	// console.log("Received event:", event);

	try {
		// Parse request body
		if (!event.body) {
			return {
				statusCode: 400,
				headers: {
					"Access-Control-Allow-Origin": "*", // Required for CORS support to work
					"Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
				},
				body: JSON.stringify({
					error: {
						code: "BAD_REQUEST",
						message: "Request body is required",
					},
				}),
			};
		}

		const body = JSON.parse(event.body);

		// Basic validation
		const requiredFields = ["title", "resourceType", "url"];

		for (const field of requiredFields) {
			if (!body[field]) {
				return {
					statusCode: 400,
					headers: {
						"Access-Control-Allow-Origin": "*", // Required for CORS support to work
						"Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
					},
					body: JSON.stringify({
						error: {
							code: "VALIDATION_ERROR",
							message: `Missing required field: ${field}`,
						},
					}),
				};
			}
		}

		// Generate IDs and timestamps
		const resourceId = `res_${uuidv4()}`;
		const now = new Date().toISOString();

		const resource = {
            ...body,
            pk: "RESOURCE",
            sk: resourceId,
            id: resourceId,
            createdAt: now,
            updatedAt: now,
        };

		const command = new PutCommand({
			TableName: "Resource",
			Item: resource,
		});

		await docClient.send(command);

		// Return the created resource
		return {
			statusCode: 201,
			headers: {
				"Access-Control-Allow-Origin": "*", // Required for CORS support to work
				"Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
			},
			body: JSON.stringify({
				data: resource,
			}),
		};
	} catch (error) {
		console.error("createResource error:", error);

		return {
			statusCode: 500,
			headers: {
				"Access-Control-Allow-Origin": "*", // Required for CORS support to work
				"Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
			},
			body: JSON.stringify({
				error: {
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong while creating the resource",
				},
			}),
		};
	}
};
