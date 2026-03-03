// helpers/getDataFromToken.js
import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    return decodedToken;
  } catch (error) {
    throw new Error(error.message);
  }
};