import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export const hashPassword = (plain) => {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(plain, salt, KEY_LENGTH).toString("hex");
    return `${salt}:${hash}`;
};

export const verifyPassword = (plain, stored) => {
    const [salt, hash] = stored.split(":");
    const hashed = scryptSync(plain, salt, KEY_LENGTH);
    return timingSafeEqual(hashed, Buffer.from(hash, "hex"));
};

export const generateToken = () => randomBytes(32).toString("hex");
