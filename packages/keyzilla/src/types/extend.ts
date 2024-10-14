import { ApiKey } from "./apikeys"
// extends the env.ts file with new api keys and values
// ? why ? you ask
// ? if you try to F12 in the `k.API_KEY` and add new keys, it will be added to the env.ts file
// ? but for no reason known the T3-env package doesn't read the new keys
interface Extend<T extends ApiKey> {
      [key: string]: T extends ApiKey ? T : never
      [key: symbol]: T extends ApiKey ? T : never
}