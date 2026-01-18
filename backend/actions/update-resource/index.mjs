export const handler = async (event) => {
	try {
		// 1. Validate path parameter
		const { id } = event.pathParameters || {};
		if (!id) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					error: {
						code: "VALIDATION_ERROR",
						message: "Resource ID is required in the path",
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

		// 3. Minimal validation
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

		// 4. Simulate existing resource
		const existingResource = {
			id,
			title: "Existing Title",
			description: "Existing Description",
			resourceType: "guide",
			url: "https://example.com",
			tags: ["unity", "physics"],
			creatorId: "creator_123",
			difficulty: "beginner",
			createdAt: "2026-01-10T12:00:00.000Z",
			updatedAt: "2026-01-10T12:00:00.000Z",
		};

		// 5. Merge updates
		const updatedResource = {
			...existingResource,
			...body,
			updatedAt: new Date().toISOString(),
		};

		console.log(`Updated resource ${id}:`, updatedResource);

		// 6. Return success
		return {
			statusCode: 200,
			body: JSON.stringify({
				data: updatedResource,
			}),
		};
	} catch (error) {
		console.error("updateResource error:", error);

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
