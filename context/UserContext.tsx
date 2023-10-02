// UserContext.tsx
import React, {createContext} from 'react';
import {User as FirebaseUser} from '@firebase/auth';
import {User} from '@/interfaces';

interface UserContextProps {
    userAuth: FirebaseUser | null;
    setUserAuth: React.Dispatch<React.SetStateAction<FirebaseUser | null>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;

}

// Initialize with default value
export const UserContext = createContext<UserContextProps>({
    userAuth: null,
    setUserAuth: () => {
    },
    user: null,
    setUser: () => {
    },
});



