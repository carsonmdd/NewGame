export const handler = async (event) => {
	// console.log("Received event:", event);

	try {
		// 1. Parse request body
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

		// 2. Basic validation (keep intentionally light)
		const requiredFields = ["title", "resourceType", "url"];

		for (const field of requiredFields) {
			if (!body[field]) {
				return {
					statusCode: 400,
					body: JSON.stringify({
						error: {
							code: "VALIDATION_ERROR",
							message: `Missing required field: ${field}`,
						},
					}),
				};
			}
		}

		// 3. Simulate resource creation
		const resourceId = `res_${Math.random().toString(36).substring(2, 10)}`;
		const now = new Date().toISOString();

		const resource = {
			id: resourceId,
			title: body.title,
			description: body.description ?? "",
			resourceType: body.resourceType,
			url: body.url,
			tags: body.tags ?? [],
			creatorId: body.creatorId ?? null,
			difficulty: body.difficulty ?? null,
			createdAt: now,
			updatedAt: now,
		};

		// 4. Return realistic success response
		return {
			statusCode: 201,
			body: JSON.stringify({
				data: resource,
			}),
		};
	} catch (error) {
		console.error("createResource error:", error);

		return {
			statusCode: 500,
			body: JSON.stringify({
				error: {
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong while creating the resource",
				},
			}),
		};
	}
};
