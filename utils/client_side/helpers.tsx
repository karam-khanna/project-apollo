import {UserAvailability} from "@/interfaces";

function getWeekStartingDate(date: Date): string {
    // Example usage
    // const date: Date = new Date('2023-10-26'); // Assuming this is a Thursday
    // console.log(getWeekStartingDate(date)); // Should return '2023-10-23' (which is the Monday of that week)
    // const givenDate = new Date(date);
    // const dayOfWeek = givenDate.getUTCDay(); // 0 (Sunday) - 6 (Saturday)
    // const difference = (dayOfWeek + 6) % 7; // Offset for Monday
    // givenDate.setUTCDate(givenDate.getUTCDate() - difference);
    // return `${givenDate.getUTCFullYear()}_${String(givenDate.getUTCMonth() + 1).padStart(2, '0')}_${String(givenDate.getUTCDate()).padStart(2, '0')}`;

    const day = date.getDay()
    const diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(date.setDate(diff));
    return `${monday.getFullYear()}_${String(monday.getMonth() + 1).padStart(2, '0')}_${String(monday.getDate()).padStart(2, '0')}`;

}


export function parseAvailabilityDocId(userId: string, date: Date): string {
    const weekStart = getWeekStartingDate(date);
    return `${userId}_${weekStart}`;
}

export function parseAvailability(userId: string, formData: string[]): UserAvailability {
    if (!userId) throw new Error('User ID is required');


    const weekStart = getWeekStartingDate(new Date());
    const docId = parseAvailabilityDocId(userId, new Date());

    return {
        id: docId,  // You can set this after pushing to Firebase (or however you choose to generate an ID)
        userId: userId,
        weekStart: weekStart,
        fridayMorning: formData.includes("fridayMorning") || false,
        fridayAfternoon: formData.includes("fridayAfternoon") || false,
        fridayEvening: formData.includes("fridayEvening") || false,
        fridayLateNight: formData.includes("fridayLateNight") || false,
        saturdayMorning: formData.includes("saturdayMorning") || false,
        saturdayAfternoon: formData.includes("saturdayAfternoon") || false,
        saturdayEvening: formData.includes("saturdayEvening") || false,
        saturdayLateNight: formData.includes("saturdayLateNight") || false,
        sundayMorning: formData.includes("sundayMorning") || false,
        sundayAfternoon: formData.includes("sundayAfternoon") || false,
        sundayEvening: formData.includes("sundayEvening") || false,
        sundayLateNight: formData.includes("sundayLateNight") || false,
    };
}

