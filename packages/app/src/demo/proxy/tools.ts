export const createJsonResponse = (data: unknown) => {
    const response = new Response(
        JSON.stringify(data),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        },
    );
    return response;
};

export const getRequestBody = async <T>(event: FetchEvent) => {
    try {
        const body = await event.request.json();
        return body as T;
    } catch {
        return null;
    }
};