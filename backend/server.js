import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNGUzNWQwMjkyNmUxZTVhNGRmYjgyOCIsImVtYWlsIjoidGVzdDEyM0BtYWlsLm1vbSIsImlhdCI6MTc4MzUxMDUwNiwiZXhwIjoxNzgzNTExNDA2fQ.7KNOZe1iCj22XBfItnvhGMg-eWoBvZ2PDnVI3fKCgDU