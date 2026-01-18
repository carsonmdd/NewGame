export const handler = async (event) => {
  try {
    // 1. Check path parameter
    const { id } = event.pathParameters || {};
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Resource ID is required in the path',
          },
        }),
      };
    }

    // 2. Simulate deletion (in-memory / mock)
    console.log(`Deleting resource with id: ${id}`);

    // 3. Return a realistic API response
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          id,
          message: 'Resource successfully deleted (mock)',
        },
      }),
    };
  } catch (error) {
    console.error('deleteResource error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while deleting the resource',
        },
      }),
    };
  }
};
