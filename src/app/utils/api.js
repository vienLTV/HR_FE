const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        ...options
    };

    // If there's a body and it's not FormData, stringify it
    if (defaultOptions.body && !(defaultOptions.body instanceof FormData)) {
        defaultOptions.body = JSON.stringify(defaultOptions.body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);

        // If the token is invalid or expired, try to refresh it
        if (response.status === 401) {
            // const newToken = await refreshToken();
            // if (newToken) {
            //     localStorage.setItem('token', newToken);
            //     defaultOptions.headers['Authorization'] = `Bearer ${newToken}`;
            //     return fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
            // } else {
            //     // If we can't refresh the token, we need to log out the user
            //     localStorage.removeItem('token');
            //     window.location.href = '/login';
            //     throw new Error('Session expired. Please log in again.');
            // }
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired. Please log in again.');
        }

        return response;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

async function uploadFile(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
        ...options
    };

    // If there's a body and it's not FormData, stringify it
    if (defaultOptions.body && !(defaultOptions.body instanceof FormData)) {
        defaultOptions.body = JSON.stringify(defaultOptions.body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);

        // If the token is invalid or expired, try to refresh it
        if (response.status === 401) {
            // const newToken = await refreshToken();
            // if (newToken) {
            //     localStorage.setItem('token', newToken);
            //     defaultOptions.headers['Authorization'] = `Bearer ${newToken}`;
            //     return fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
            // } else {
            //     // If we can't refresh the token, we need to log out the user
            //     localStorage.removeItem('token');
            //     window.location.href = '/login';
            //     throw new Error('Session expired. Please log in again.');
            // }
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired. Please log in again.');
        }

        return response;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

export const api = {
    get: (endpoint) => fetchWithAuth(endpoint),
    post: (endpoint, body) => fetchWithAuth(endpoint, { method: 'POST', body }),
    postFile: (endpoint, body) => uploadFile(endpoint, { method: 'POST', body }),
    put: (endpoint, body) => fetchWithAuth(endpoint, { method: 'PUT', body }),
    delete: (endpoint) => fetchWithAuth(endpoint, { method: 'DELETE' }),
    // Add other methods as needed
};