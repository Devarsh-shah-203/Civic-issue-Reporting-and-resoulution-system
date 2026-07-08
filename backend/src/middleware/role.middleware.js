import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const authorize = (...roles) => {

    return asyncHandler(async (req, res, next) => {

          console.log("Current User:", req.user); 
        console.log("Required Roles:", roles);
        console.log("User Role:", req.user?.role);
        if (!req.user) {

            throw new ApiError(
                401,
                "Authentication required."
            );

        }

        if (!roles.includes(req.user.role)) {

            throw new ApiError(
                403,
                "Access denied. You are not authorized to access this resource."
            );

        }

        next();

    });

};