import {User as FirebaseUser} from "@firebase/auth";
import {User} from "@/interfaces";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {clientSideGetUser} from "./clientDbInterface";
import {db} from "@/components/firebase";

export async function getOrCreateUserFromAuth(authUser: FirebaseUser): Promise<User> {
    let user: User | null = await clientSideGetUser(authUser.uid);
    if (user) {
        return user;
    }
    // create user
    const docRef = doc(db, 'Users', authUser.uid);
    await setDoc(docRef, {name: authUser.displayName, email: authUser.email}, {merge: true});
    const newSnap = await getDoc(docRef);

    // check if snap there
    if (!newSnap.exists()) {
        throw new Error('User still not in database! Something very wrong');
    }

    user = await clientSideGetUser(authUser.uid);

    // check user there
    if (!user) {
        throw new Error('User still not in database! Something very wrong');
    }
    return user;
}