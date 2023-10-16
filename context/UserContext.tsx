import React, { createContext, useState, ReactNode } from 'react';
import { User as FirebaseUser } from '@firebase/auth';
import { User } from '@/interfaces';

interface UserContextProps {
    userAuth: FirebaseUser | null;
    setUserAuth: React.Dispatch<React.SetStateAction<FirebaseUser | null>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    chats: string[];
    setChats: React.Dispatch<React.SetStateAction<string[]>>;
}

// Initialize with default value
export const UserContext = createContext<UserContextProps>({
    userAuth: null,
    setUserAuth: () => {},
    user: null,
    setUser: () => {},
    chats: [],
    setChats: () => {},
});

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [userAuth, setUserAuth] = useState<FirebaseUser | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [chats, setChats] = useState<string[]>([]);

    return (
        <UserContext.Provider value={{ userAuth, setUserAuth, user, setUser, chats, setChats }}>
            {children}
        </UserContext.Provider>
    );
};


