import { customAlphabet } from 'nanoid'
import { NANOID_LENGTH } from "src/entity/User";

const nanoid = customAlphabet('23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ', NANOID_LENGTH)

export function createPin() {
    return nanoid()
}
