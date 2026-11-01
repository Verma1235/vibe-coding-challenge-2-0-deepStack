import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

// JWT Token generate karne ka function
export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Token 1 din ke liye valid rahega
    .sign(key);
}

// JWT Token ko verify aur decrypt karne ka function
export async function decrypt(input) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null; // Agar token expire ho gaya ya galat hai
  }
}