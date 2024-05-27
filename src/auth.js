import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import getAccessToken from "./components/getAccessToken";
import dateInSeconds from "./components/dateInSeconds";

// const crypto = require('crypto');
// const SECRET_KEY = crypto.randomBytes(32).toString('hex');


const prisma = new PrismaClient();

export async function signIn(credentials) {
  try {
    const { email, password } = credentials;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    console.log(user)
    if (user && user.password !== password) {
      return {
        success: false,
        error: "Invalid credentials.",
      };
    }
    console.log(user.secretKey);
    const token = jwt.sign({ email }, user.secretKey, {
      expiresIn: "6h",
    });
    let tokenIfood_1 = user.tokenIfood_1;
    if (user.tokenIfood_1) {
      const expiresIn = user.expiresIn;
      const createAt = dateInSeconds(user.tokenIfood_1CreateAt);
      const now = Math.floor(Date.now() / 1000);

      if ((createAt + expiresIn) < now) {
        // Token has expired, fetch a new one
        try {
          const newToken = await getAccessToken(user.clientId, user.clientSecret);
          tokenIfood_1 = newToken.accessToken;

          await prisma.user.update({
            where: { email },
            data: {
              tokenIfood_1: newToken.accessToken,
              tokenType: newToken.tokenType,
              expiresIn: newToken.expiresIn,
     
           
            },
          });
        } catch (error) {
          return { success: false, error: "Error fetching new iFood access token." };
        }
      }
    } else {
      // No token exists, fetch a new one
      try {
        const newToken = await getAccessToken(user.clientId, user.clientSecret);
        tokenIfood_1 = newToken.accessToken;

        await prisma.user.update({
          where: { email },
          data: {
            tokenIfood_1: newToken.accessToken,
            tokenType: newToken.tokenType,
            expiresIn: newToken.expiresIn,
   
            
          },
        });
      } catch (error) {
        return { success: false, error: "Error fetching new iFood access token." };
      }
    }

    console.log(user);
    return {
      success: true,
      token,
      tokenIfood_1,
      user: {
        id: user.id,
        email: user.email,
        // Otros campos de usuario que desees incluir
      },
      message: "Authenticated with success!",
    };
  } catch (error) {
    console.error("Error al autenticar usuario:", error);
    return {
      success: false,
      msg: "Something went wrong.",
      error, error
    };
  }
}
