import { auth } from "express-oauth2-jwt-bearer";
import{Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken'
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: String;
      auth0Id: String;
    }
  }
}

export const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256',
  });

console.log("Auth0 Audience:", process.env.AUTH0_AUDIENCE);
console.log("Auth0 Issuer Base URL:", process.env.AUTH0_ISSUER_BASE_URL);


export const jwtParse = async(req: Request, res:Response, next: NextFunction)=> {

  const { authorization } = req.headers;


  if(!authorization || !authorization.startsWith("Bearer ")){
    return res.sendStatus(401);
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id});


    // '|| !user._id' is get from Chat GPT to resolved the error for user._id
    if(!user || !user._id){
      return res.sendStatus(401);
    }

    req.auth0Id = auth0Id as String;
    req.userId = user._id.toString();
    next();

  } catch (error) {
    return res.sendStatus(401);
  }
};