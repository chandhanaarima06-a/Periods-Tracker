import { useAuth } from '@clerk/clerk-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api';

export function useCycleApi() {
    const { getToken } = useAuth();

    async function fetchWithAuth(url, options = {}) {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    return {
        getCycles: () => fetchWithAuth('/v1/cycles'),
        createCycle: (cycleEntry) => fetchWithAuth('/v1/cycles', {
            method: 'POST',
            body: JSON.stringify(cycleEntry),
        }),
        getCycle: (id) => fetchWithAuth(`/v1/cycles/${id}`),
        getPrediction: () => fetchWithAuth('/v1/cycles/prediction'),
    };
}