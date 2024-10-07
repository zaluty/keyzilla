import { auth } from "@clerk/nextjs/server";
export function checkUserRole(session: any) {
    const { debug, sessionClaims } = auth();
    debug();
    if (
        !session ||
        !session.user ||
        !session.user.organizationMemberships ||
        session.user.organizationMemberships.length === 0
    ) {
        return null; // Return null if the user is not a basic member
    }

    const organizationMemberships = session.user.organizationMemberships;

    // Loop through all organization memberships
    for (const membership of organizationMemberships) {
        if (membership.role) {
            return membership.role.toLowerCase(); // Return the role in lowercase if it exists
        }
    }

    return null; // Return null if no role is found in the memberships
}
