import {DocumentData} from '@firebase/firestore';
import {Interest, User} from '@/interfaces';
import {Auth, getAuth} from '@firebase/auth';

export function userFromDbData(data: DocumentData, userId: string): User {

    return {
        id: userId || '',
        email: data.email || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        poker: data.poker || false,
        basketball: data.basketball || false,
        onboarded: data.onboarded || false,
        picture: data.picture || 'https://github.com/shadcn.png',
        age: data.age || '',
        response: data.response || false,
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
