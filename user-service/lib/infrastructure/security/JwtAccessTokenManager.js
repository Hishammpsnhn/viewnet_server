
import jwt from 'jsonwebtoken';
import IAccessTokenManager from '../../domain/interfaces/IAccessTokenManager.js';
import env from '../config/environment.js';



export default class JwtAccessTokenManager extends IAccessTokenManager {

    generate(payload, expiry) {
        return jwt.sign(payload, env.JWT_SECRET, { expiresIn: expiry });
    }

    decode(accessToken) {
        try {
            return jwt.verify(accessToken, env.JWT_SECRET);
        } catch (error) {
            throw Object.assign(new Error("unauthorized."), { statusCode: 401 });
        }
    }
}