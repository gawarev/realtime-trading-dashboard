import {useState} from 'react';

function isValidToken(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

function getStoredToken(): string | null {
    const token = localStorage.getItem('auth_token');
    if (token && isValidToken(token)) return token;
    if (token) localStorage.removeItem('auth_token');
    return null;
}

export function useAuth() {
    const [token, setToken] = useState<string | null>(getStoredToken);
    console.log('useAuth: token', token);

    async function login(username: string, password: string): Promise<void> {
        const res = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error ?? 'Login failed');
        }
        const { token: newToken } = await res.json();
        localStorage.setItem('auth_token', newToken);
        setToken(newToken);
    }

    function logout() {
        localStorage.removeItem('auth_token');
        setToken(null);
    }

    return {
        token,
        login,
        logout,
        isAuthenticated: token !== null
    };

}