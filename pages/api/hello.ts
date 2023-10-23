import {NextApiRequest, NextApiResponse} from "next";
import {Interest, timeSlots, UserAvailability} from "@/interfaces";
import {
    findAvailableForTimeAndInterest,
    getUserFromDb,
    updateUserAvailability
} from "@/utils/server_side/serverDbInterface";
import {getUsersInterestsAsArray, getWeekStartingDate, parseAvailabilityDocId} from "@/utils/client_side/helpers";
import {admin_db} from "@/firebase/server_side/firebase_admin_init";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // let action: string = "create"
    let action: string = "match"
    // let action: string = "cleanup"


    const userIds = ["22xY4MdKc4Mje4RLAeBAnEwV21N2", "3DeCsKZMNAMXgA4qEFhUYDCfGJu2", "7bPrtZdXVvN4DNL9Z3xI1GWuOaM2", "8bZndHi5wUV6dqWPuHE8O8HMeT42"]
    if (action === "create") {
        // create some nonsense documents here
        for (const userId of userIds) {
            const user = await getUserFromDb(userId);
            if (!user) {
                continue;
            }
            const weekStart = getWeekStartingDate(new Date(), false);
            const docId = parseAvailabilityDocId(userId, new Date());
            const availability: UserAvailability = {
                id: docId,
                userId: userId,
                weekStart: weekStart,
                fridayMorning: true,
                fridayAfternoon: false,
                fridayEvening: false,
                fridayLateNight: false,
                saturdayMorning: false,
                saturdayAfternoon: false,
                saturdayEvening: false,
                saturdayLateNight: false,
                sundayMorning: false,
                sundayAfternoon: false,
                sundayEvening: false,
                sundayLateNight: false,
                interests: getUsersInterestsAsArray(user),
            }

            if (user) {
                await updateUserAvailability(user, availability);
            }
        }

        res.status(200).json({message: 'done'});

    } else if (action === "cleanup") {
        for (const userId of userIds) {
            // parse the doc id
            const docId = parseAvailabilityDocId(userId, new Date());
            // delete it from the database
            const docRef = admin_db.doc(`UserAvailability/${docId}`);
            await docRef.delete();
        }
    } else if (action === "match") {
        const matches = await findAvailableForTimeAndInterest(timeSlots.fridayMorning, new Date(), Interest.basketball);
        console.log(matches);
        res.status(200).json({matches: matches});
    }
}
