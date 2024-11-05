/**
 * Context for user.
 * Data shared across application.
 */

import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

function UserProdiver({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("currentUser")));
    const navigate = useNavigate();

    // sync token with local storage when it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        }   else {
            localStorage.removeItem("token");
        }
    }, [token])

    // sync currentUser with localStorage when it changes
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }   else {
            localStorage.removeItem("currentUser");
        }
    }, [currentUser])

    const logout = () => {
        setToken(null);
        setCurrentUser(null);
        navigate('/');
    };

    return (
        <UserContext.Provider value={{ token, setToken, currentUser, setCurrentUser, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserProdiver }
export default UserContext;