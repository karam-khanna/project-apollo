import {User} from '@/interfaces';
import React from 'react';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {userFromDbData} from './clientUserUtils';
import {db} from "@/components/firebase";

export async function clientSideGetUser(userId: string): Promise<User | null> {
    const docRef = doc(db, 'Users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return userFromDbData(docSnap.data(), userId);
    }
    return null;
}

export async function updateCanvasToken(
        user: User,
        canvasToken: string,
        setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<boolean> {
    return updateUserField(user, 'canvasToken', canvasToken, setUser);
}

export async function updateCanvasDomain(
        user: User,
        canvasDomain: string,
        setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<boolean> {
    return updateUserField(user, 'canvasDomain', canvasDomain, setUser);
}

export async function updateUserOnboarded(
        user: User,
        onboarded: boolean,
        setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<boolean> {
    return updateUserField(user, 'onboarded', onboarded, setUser);
}


async function updateUserField(
        user: User,
        field: string,
        value: any,
        setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<boolean> {
    /* Update a field in the user document in firestore and in state */

    // Get a reference to the user document in firestore
    const userRef = doc(db, 'Users', user.id);
    await setDoc(userRef, {[field]: value}, {merge: true});

    // Update the local state
    setUser({
        ...user,
        [field]: value,
    });

    return true;
}


