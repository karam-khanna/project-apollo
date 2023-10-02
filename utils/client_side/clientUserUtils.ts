import {DocumentData} from '@firebase/firestore';
import {User} from '@/interfaces';
import {Auth, getAuth} from '@firebase/auth';

export function userFromDbData(data: DocumentData, userId: string): User {
    return {
        id: userId || '',
        email: data.email || '',
        name: data.name || '',
        onboarded: data.onboarded || false,
        basketball: data.basketball || false,
        poker: data.poker || false,
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
