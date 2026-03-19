import { algoliasearch } from 'algoliasearch';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = algoliasearch(
	process.env.ALGOLIA_APP_ID,
	process.env.ALGOLIA_ADMIN_KEY,
);
const indexName = 'resources';

export const handler = async (event) => {
	const toSave = [];
	const toDelete = [];

	for (const record of event.Records) {
		console.log('RECORD HEREEE\n', record, '\n');
		const eventName = record.eventName; // INSERT, MODIFY, or REMOVE

		// Convert DynamoDB JSON to standard JS Object
		const fullData = record.dynamodb.NewImage
			? unmarshall(record.dynamodb.NewImage)
			: null;
		const keys = unmarshall(record.dynamodb.Keys);
		console.log('FULL DATA', fullData)

		if (eventName === 'REMOVE') {
			toDelete.push(keys.sk);
		} else {
			// Map resourceID to Algolia's required objectID
			toSave.push({
				...fullData,
				objectID: fullData.id,
			});
		}
	}

	// Perform batch operations (more efficient than individual calls)
	if (toSave.length)
		await client.saveObjects({
			indexName,
			objects: toSave,
		});
	if (toDelete.length)
		await client.deleteObjects({ indexName, objectIDs: toDelete });

	return { status: 'Sync Complete' };
};
