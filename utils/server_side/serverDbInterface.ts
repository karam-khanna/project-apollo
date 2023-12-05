import {Interest, Invitation, Timeslots, User, UserAvailability} from "@/interfaces";
import {admin_db} from "@/firebase/server_side/firebase_admin_init";
import {getWeekStartingDateAsString, parseAvailabilityDocId} from "@/utils/client_side/helpers";

export async function getUserFromDb(userId: string): Promise<User | null> {
    const docRef = admin_db.doc(`Users/${userId}`);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
        console.log('User not in database!');
        return null;
    }

    return docSnap.data() as User;
}

export async function getUserAvailability(userId: string): Promise<UserAvailability | null> {
    const docId = parseAvailabilityDocId(userId, new Date());
    const docRef = admin_db.doc(`UserAvailability/${docId}`);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
        console.log('User availability not in database!');
        return null;
    }
    return docSnap.data() as UserAvailability;
}

export async function updateUserAvailability(
        user: User,
        availability: UserAvailability,
): Promise<boolean> {
    const docId = availability.id;
    const docRef = admin_db.doc(`UserAvailability/${docId}`);
    try {
        await docRef.set(availability);
    } catch (e) {
        console.log('error updating availability', e);
        console.log('got here 44')
        return false;
    }

    return true;
}

export async function findAvailableForTimeAndInterest(
        timeslot: Timeslots,
        date: Date,
        interest: Interest,
): Promise<User[]> {
    const weekStart = getWeekStartingDateAsString(date, false);
    const query = admin_db.collection('UserAvailability')
            .where('weekStart', '==', weekStart)
            .where(timeslot, '==', true)
            .where('interests', 'array-contains', interest);

    const snapshot = await query.get();
    const avails: UserAvailability[] = [];
    snapshot.forEach((doc) => {
        avails.push(doc.data() as UserAvailability);
    });

    const users: User[] = [];
    for (let avail of avails) {
        const user = await getUserFromDb(avail.userId);
        if (user) {
            user.id = avail.userId;
            users.push(user);
        }
    }

    return users;
}

export async function addInviteToDb(invite: Invitation): Promise<Invitation | null> {
    const docId = invite.id;
    const docRef = admin_db.doc(`Invitations/${docId}`);

    // check if the doc already exists
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        console.log('invite already exists!');
        return docSnap.data() as Invitation;
    } else {
        try {
            await docRef.set(invite);
            console.log("success!")
            return invite;
        } catch (e) {
            console.log('error adding invite to db', e);
            return null;
        }
    }
}

export async function updateInviteStatus(inviteId: string, status: string): Promise<boolean> {
    const docRef = admin_db.doc(`Invitations/${inviteId}`);
    try {
        await docRef.update({status: status});
    } catch (e) {
        console.log('error updating invite status', e);
        return false;
    }

    return true;
}

export async function getInvitesForUser(userId: string, date: Date): Promise<Invitation[]> {
    const weekStart = getWeekStartingDateAsString(date, true);
    const query = admin_db.collection('Invitations')
            .where('userId', '==', userId)
            .where('date', '==', weekStart)
    const snapshot = await query.get();
    const invites: Invitation[] = [];
    snapshot.forEach((doc) => {
        invites.push(doc.data() as Invitation);
    });
    return invites;
}

