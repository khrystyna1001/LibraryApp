import { createContext, useContext } from "react";

const AuthContext = createContext(null);
const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('The useAuth hook must be used within an AuthProvider. Please ensure your application is wrapped correctly.');
    }
    return context;
};

export {useAuth, AuthContext};