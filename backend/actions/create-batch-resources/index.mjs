import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	BatchWriteCommand,
	DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const headers = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Credentials": true,
};

export const handler = async (event) => {
	try {
		if (!event.body) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({ message: "Body required" }),
			};
		}

		const { items } = JSON.parse(event.body);

		if (!Array.isArray(items) || items.length === 0) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({ message: "Items array required" }),
			};
		}

		if (items.length > 25) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({ message: "Max 25 items per batch" }),
			};
		}

		const now = new Date().toISOString();

		const putRequests = items.map((item) => {
			const resourceId = `res_${uuidv4()}`;
			return {
				PutRequest: {
					Item: {
						pk: "RESOURCE",
						sk: resourceId,
						id: resourceId,
						title: item.title,
						description: item.description ?? "",
						resourceType: item.resourceType,
						url: item.url,
						tags: item.tags ?? [],
						creatorId: item.creatorId ?? null,
						difficulty: item.difficulty ?? null,
						createdAt: now,
						updatedAt: now,
					},
				},
			};
		});

		const command = new BatchWriteCommand({
			RequestItems: {
				Resource: putRequests,
			},
		});

		const response = await docClient.send(command);

		const unprocessed = response.UnprocessedItems?.Resource || [];

		return {
			statusCode: unprocessed.length > 0 ? 207 : 201, // 207 = Multi-Status (partial success)
			headers,
			body: JSON.stringify({
				processedCount: items.length - unprocessed.length,
				unprocessedCount: unprocessed.length,
				unprocessedItems: unprocessed,
			}),
		};
	} catch (error) {
		console.error("batchCreate error:", error);
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({ error: "Internal Server Error" }),
		};
	}
};
