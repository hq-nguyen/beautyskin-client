import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { logout } from "../redux/features/userSlice"; // Adjust path as needed
// import { useDispatch } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
//   const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      // Redirect to login page if not authenticated
      navigate("/login");
      return;
    }

    // For routes accessible to any logged-in user
    if (!allowedRoles) {
      return;
    }

    // Check if user has the required role
    // Flatten the allowedRoles array in case it contains nested arrays
    const flatRoles = allowedRoles.flat();
    
    // Use roleEnum instead of role
    if (flatRoles.length > 0 && !flatRoles.includes(user.roleEnum)) {
      // Redirect to unauthorized page if user doesn't have required role
      console.log("Unauthorized access - user role:", user.roleEnum, "allowed roles:", flatRoles);
      navigate("/unauthorized");
    }
  }, [user, allowedRoles, navigate]);

  // If checks pass, render the children
  return children;
};

export default ProtectedRoute;