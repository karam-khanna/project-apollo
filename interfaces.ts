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


export interface UserAvailability {
    id: string;
    userId: string;
    weekStart: string;
    fridayMorning: boolean;
    fridayAfternoon: boolean;
    fridayEvening: boolean;
    fridayLateNight: boolean;
    saturdayMorning: boolean;
    saturdayAfternoon: boolean;
    saturdayEvening: boolean;
    saturdayLateNight: boolean;
    sundayMorning: boolean;
    sundayAfternoon: boolean;
    sundayEvening: boolean;
    sundayLateNight: boolean;
}

