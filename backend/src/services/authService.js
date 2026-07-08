import bcrypt from "bcryptjs";


// Hash password
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};


// Compare password
export const comparePassword = async (
    password,
    hashedPassword
) => {
    return await bcrypt.compare(
        password,
        hashedPassword
    );
};