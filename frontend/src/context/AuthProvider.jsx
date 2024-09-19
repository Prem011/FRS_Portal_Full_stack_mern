import React, { createContext, useState, useEffect } from 'react'
import Cookies from "js-cookie"
import { useContext } from 'react';
export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const cookieUser = Cookies.get("jwt");
        const localUser = localStorage.getItem("FRS");
        if (cookieUser || localUser) {
            setAuthUser(JSON.parse(localUser || cookieUser));
        }
    }, []);

    const login = (user) => {
        try {
           
            if (!user || !user.token) {
                throw new Error('Invalid user object or missing token');
            }
            setAuthUser(user);
            localStorage.setItem('FRS', JSON.stringify(user));
            Cookies.set('jwt', user.token, { expires: 1 }); 

        } catch (error) {
            console.error('Error setting login state:', error);
            // Handle the error (e.g., show a notification to the user)
        }
    };
    

    const logout = () => {
        setAuthUser(null);
        localStorage.removeItem("FRS");
        Cookies.remove("jwt");
    };



  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
    {children}
</AuthContext.Provider>
  )
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);


