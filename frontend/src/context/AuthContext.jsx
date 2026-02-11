import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jobtracker_token');
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const data = await apiLogin(username, password);
        const token = data.access;
        localStorage.setItem('jobtracker_token', token);
        setUser({ token });
        return data;
    };

    const signup = async (username, email, password) => {
        await apiSignup(username, email, password);
    };

    const logout = () => {
        localStorage.removeItem('jobtracker_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
