import { text } from "@clack/prompts";
import { UserData } from "../types/userData";
import { getAuthCache } from "../auth/lib/authCache";

function whoami() {
    const userData = getAuthCache();
    if (!userData) {
        throw new Error("User data not found");
    }
    // Display the message to the user but return the userData object directly
    console.log(`You are logged in as ${userData.email}`);
     
}

whoami();
export { whoami };
