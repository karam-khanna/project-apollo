export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    onboarded: boolean;
    poker: boolean;
    basketball: boolean;

}

// set up interests enum
export enum Interest {
    basketball = 'basketball',
    poker = 'poker',
}


