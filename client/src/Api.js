const API_BASE_URL = (import.meta.env?.VITE_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    return response.json();
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    return response.json();
};

export const getCurrentUserProfile = async (token) => {
    const response = await fetch(`${API_BASE_URL}/me`, {
        headers: { "Authorization": `Bearer ${token}` },
    });
    return response.json();
};

export const uploadPDF = async (file, numQuestions, token) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("num_questions", numQuestions);

    const response = await fetch(`${API_BASE_URL}/test/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
    });
    return response.json();
};

export const getGeneratedTest = async (testId, token) => {
    const response = await fetch(`${API_BASE_URL}/test/${testId}`, {
        headers: { "Authorization": `Bearer ${token}` },
    });
    return response.json();
};
