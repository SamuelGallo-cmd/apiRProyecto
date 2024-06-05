import { expressjwt } from "express-jwt";
import jwt from 'jsonwebtoken';
import {getUserByEmail} from "./services/usuarios.js";



const secret = Buffer.from('assddsqwexxs', 'base64');
export const authMiddleware=expressjwt({
    algorithms:['HS256'],
    credentialsRequired: false,
    secret,
});

export async function login(req, res){
    const {email,password}=req.body;
    const user = await getUserByEmail(email);
    if(!user||user.password!==password){
        res.sendStatus(401);
    }else{
        const claims={sub:user.id,email:user.email,name:user.name};
        const token = jwt.sign(claims,secret);
        res.json({token});
    }
}

export async function decodeToken(token){
    try{
        jwt.verify(token,secret);
    }catch(error){
        console.log("Error al decodificar el toekn", error);
        return null;
    }
}