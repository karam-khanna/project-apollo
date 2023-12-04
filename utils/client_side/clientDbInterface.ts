import {Interest, User} from '@/interfaces';
import React from 'react';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {userFromDbData} from './clientUserUtils';
import {db} from "@/firebase/client_side/firebase_init";

export async function clientSideGetUser(userId: string): Promise<User | null> {
    const docRef = doc(db, 'Users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return userFromDbData(docSnap.data(), userId);
    }
    return null;
}

export async function updateUserResponse(
    user: User,
    response: boolean,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<boolean> {
return updateUserField(user, 'response', response, setUser);
}

export async function updateUserFirstName(
        user: User,
        firstName: string,
        setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<boolean> {
    return updateUserField(user, 'firstName', firstName, setUser);
}

export async function updateUserLastName(
        user: User,
        lastName: string,
        setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<boolean> {
    return updateUserField(user, 'lastName', lastName, setUser);
}

export async function updateUserPhone(
    user: User,
    phone: string,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<boolean> {
return updateUserField(user, 'phone', phone, setUser);
}


export async function updateUserOnboarded(
        user: User,
        onboarded: boolean,
        setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<boolean> {
    return updateUserField(user, 'onboarded', onboarded, setUser);
}

export async function updateUserPoker(
        user: User,
        poker: boolean,
        setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<boolean> {
    return updateUserField(user, 'poker', poker, setUser);
}

export async function updateUserBasketball(
        user: User,
        basketball: boolean,
        setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<boolean> {
    return updateUserField(user, 'basketball', basketball, setUser);
}

export async function updateUserInterest(
        user: User,
        interest: Interest,
        interested: boolean,
        setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<boolean> {

    if (interest) {
        return updateUserField(user, interest, interested, setUser);
    } else {
        return false;
    }
}

export async function updateUserPicture(
    user: User,
    pictureUrl: string,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
  ): Promise<boolean> {
    return updateUserField(user, 'picture', pictureUrl, setUser);
  }  

export async function updateUserAge(
    user: User,
    age: number, // Assuming age is a number
    setUser: React.Dispatch<React.SetStateAction<User | null>>
  ): Promise<boolean> {
    return updateUserField(user, 'age', age, setUser);
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


