import { SignJWT, jwtVerify } from 'jose'
import { compare, hash } from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-fallback-secret-key'
)

export async function hashPassword(password) {
  return await hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return await compare(password, hashedPassword)
}

export async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET)
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    throw new Error('Invalid token')
  }
}