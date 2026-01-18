export const handler = async (event) => {
	try {
		// 1. In Proxy Integration, the ID usually comes from pathParameters
		// Example URL: /resources/res_eec3nxex
		console.log("Received event: ", JSON.stringify(event, null, 2));
		const resourceId = event.pathParameters?.id;

		if (!resourceId) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					error: {
						code: "MISSING_ID",
						message: "Resource ID is required in the path",
					},
				}),
			};
		}

		// 2. Simulate a Database Fetch (e.g., DynamoDB.get)
		// For now, we return a mock object that looks like the 'create' output
		const mockResource = {
			id: resourceId,
			title: "Unity Tutorial",
			description: "A comprehensive guide to Unity basics.",
			resourceType: "video",
			url: "https://www.youtube.com/watch?v=XtQMytORBmM",
			tags: ["unity", "beginner"],
			creatorId: "user_123",
			difficulty: "beginner",
			createdAt: "2026-01-18T01:53:30.728Z",
			updatedAt: "2026-01-18T01:53:30.728Z",
		};

		// 3. Simulate "Not Found" logic
		if (resourceId === "not_found") {
			return {
				statusCode: 404,
				body: JSON.stringify({
					error: {
						code: "NOT_FOUND",
						message: `Resource with ID ${resourceId} does not exist`,
					},
				}),
			};
		}

		// 4. Return success response
		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				data: mockResource,
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
