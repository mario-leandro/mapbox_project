export const sendRequest = async (path, payload = null, method = "GET") => {
    const response = await fetch(`http://localhost:8000${path}`, {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer `
        },
        body: method !== "GET" && payload ? JSON.stringify(payload) : undefined
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}