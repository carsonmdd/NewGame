import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
	try {
		const { pk, sk } = event.pathParameters || {};
		if (!pk || !sk) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					error: {
						code: "VALIDATION_ERROR",
						message: "Both PK and SK are required in the path",
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
			body: JSON.stringify({
				error: {
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong while deleting the resource",
				},
			}),
		};
	}
};
