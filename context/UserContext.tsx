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


export const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://eightball.vercel.app/';

