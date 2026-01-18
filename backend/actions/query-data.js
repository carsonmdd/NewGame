import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async () => {
	const command = new QueryCommand({
		TableName: "HappyAnimals",
		KeyConditionExpression: "CommonName = :commonName",
		ExpressionAttributeValues: {
			":commonName": "Shiba Inu",
		},
		ConsistentRead: true,
	});

	const response = await docClient.send(command);
	console.log(response);
	return response;
};

main();
