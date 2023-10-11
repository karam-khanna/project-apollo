import {DocumentData} from '@firebase/firestore';
import {Interest, User} from '@/interfaces';
import {Auth, getAuth} from '@firebase/auth';

export function userFromDbData(data: DocumentData, userId: string): User {

    return {
        id: userId || '',
        email: data.email || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        poker: data.poker || false,
        basketball: data.basketball || false,
        onboarded: data.onboarded || false,
    };
}


export async function getUserAuthToken(): Promise<string> {
    const auth: Auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error('User is not authenticated');
    }

    return await currentUser.getIdToken(false);
}
