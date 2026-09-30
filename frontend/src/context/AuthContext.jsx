import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCurrentUser, login as apiLogin, logout as apiLogout } from '../lib/api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const clearAuth = () => { setUser(null); setLoading(false); };
        window.addEventListener('jobconnect:unauthorized', clearAuth);
        const initAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const userData = await fetchCurrentUser();
                    if (active) setUser(userData.user);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('jobconnect_session');
                }
            }
            if (active) setLoading(false);
        };
        initAuth();
        return () => { active = false; window.removeEventListener('jobconnect:unauthorized', clearAuth); };
    }, []);

    const login = async (credentials) => {
        const data = await apiLogin(credentials);
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('jobconnect_session');
            localStorage.removeItem('jobconnect_saved_jobs');
            localStorage.removeItem('jobconnect_notifications');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
