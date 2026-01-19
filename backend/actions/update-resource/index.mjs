import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
	try {
		// 1. Extract path parameters
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

		// 2. Parse request body
		if (!event.body) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					error: {
						code: "BAD_REQUEST",
						message: "Request body is required",
					},
				}),
			};
		}

		const body = JSON.parse(event.body);

		// 3. Validate resourceType if provided
		if (
			body.resourceType &&
			!["guide", "video", "tool"].includes(body.resourceType)
		) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					error: {
						code: "VALIDATION_ERROR",
						message: "Invalid resourceType",
					},
				}),
			};
		}

		// 4. Build DynamoDB UpdateExpression dynamically
		const updateFields = { ...body, updatedAt: new Date().toISOString() };
		const ExpressionAttributeNames = {};
		const ExpressionAttributeValues = {};
		const setExpressions = [];

		Object.keys(updateFields).forEach((key, idx) => {
			const attrName = `#field${idx}`;
			const attrValue = `:value${idx}`;
			ExpressionAttributeNames[attrName] = key;
			ExpressionAttributeValues[attrValue] = updateFields[key];
			setExpressions.push(`${attrName} = ${attrValue}`);
		});

		const command = {
			TableName: "Resource",
			Key: { pk: pk, sk: sk },
			UpdateExpression: "SET " + setExpressions.join(", "),
			ExpressionAttributeNames,
			ExpressionAttributeValues,
			ConditionExpression:
				"attribute_exists(pk) AND attribute_exists(sk)", // ensures the item exists
			ReturnValues: "ALL_NEW", // return the updated item
		};

		// 5. Perform the update
		const result = await docClient.send(new UpdateCommand(command));

		// 6. Return success with updated resource
		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				data: result.Attributes,
			}),
		};
	} catch (error) {
		console.error("updateResource error:", error);

		// Handle item not found
		if (error.name === "ConditionalCheckFailedException") {
			return {
				statusCode: 404,
				body: JSON.stringify({
					error: {
						code: "NOT_FOUND",
						message: "Resource does not exist",
					},
				}),
			};
		}

		return {
			statusCode: 500,
			body: JSON.stringify({
				error: {
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong while updating the resource",
				},
			}),
		};
	}
};
