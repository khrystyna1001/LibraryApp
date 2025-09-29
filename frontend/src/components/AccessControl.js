import { useAuth } from "../utils/authContext";

const AccessControl = ({ allowedRoles, children }) => {
    const { user } = useAuth();
    if (user.isAuthenticated && allowedRoles.includes(user.role)) {
      return <>{children}</>;
    }
    return null;
};

export default AccessControl;