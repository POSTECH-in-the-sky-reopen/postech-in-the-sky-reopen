import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";

export type Payload = {
    studentId: number,
    isAdmin: boolean
}

export function createToken(payload: Payload) {
    const secret = process.env.JWT_SECRET
    if (secret === undefined) {
        throw new Error('Cannot find JWT secret.')
    }
    return jwt.sign(payload, secret, { expiresIn: '1d' })
}

export function verifyToken(token: string) {
    const secret = process.env.JWT_SECRET
    if (secret === undefined) {
        throw new Error('Cannot find JWT secret.')
    }
    try {
        const decodedPayload = jwt.verify(token, secret)
        if (typeof decodedPayload === 'string') {
            throw JsonWebTokenError
        }
        return decodedPayload as Payload
    } catch (err) {
        throw err
    }
}

export function readToken(token: string) {
    try {
        const decodedPayload = jwt.decode(token)
        if (typeof decodedPayload === 'string') {
            throw JsonWebTokenError
        }
        if ( decodedPayload === null) {
            throw JsonWebTokenError
        }
        return decodedPayload as Payload
    } catch (err) {
        throw JsonWebTokenError
    }
}
