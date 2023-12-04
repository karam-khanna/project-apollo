import {NextApiRequest, NextApiResponse} from "next";
import {UserAvailability} from "@/interfaces";
import {getUserAvailability, getUserFromDb, updateUserAvailability} from "@/utils/server_side/serverDbInterface";
import {getWeekStartingDateAsString, parseAvailabilityDocId} from "@/utils/client_side/helpers";
import {admin_db} from "@/firebase/server_side/firebase_admin_init";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const userId = req.query.userId
        const user = await getUserFromDb(userId as string)

        if (!user) {
            res.status(400).json({error: 'No user found'});
            return;
        }

        const availability = await getUserAvailability(user.id);
        if (!availability) {
            // // return empty availability
            // const docId = parseAvailabilityDocId(user.id, new Date());
            // const weekStart = getWeekStartingDateAsString(new Date(), false);
            // const availability: UserAvailability = {
            //     id: docId,
            //     userId: user.id,
            //     weekStart: weekStart,
            //     fridayMorning: false,
            //     fridayAfternoon: false,
            //     fridayEvening: false,
            //     fridayLateNight: false,
            //     saturdayMorning: false,
            //     saturdayAfternoon: false,
            //     saturdayEvening: false,
            //     saturdayLateNight: false,
            //     sundayMorning: false,
            //     sundayAfternoon: false,
            //     sundayEvening: false,
            //     sundayLateNight: false,
            //     interests: [],
            return res.status(200).json({});
        }
        // get string of each free time
        const freeTimes = Object.keys(availability).filter((key) => {
            return availability[key as keyof UserAvailability] === true;
        });
        res.status(200).json({items: freeTimes});
    } else {
        res.status(400).json({error: 'Only takes GET'});
    }
}
