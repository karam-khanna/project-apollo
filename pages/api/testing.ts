import {NextApiRequest, NextApiResponse} from "next";
import {Interest, Timeslots, UserAvailability} from "@/interfaces";
import {
    findAvailableForTimeAndInterest,
    getUserFromDb,
    updateUserAvailability
} from "@/utils/server_side/serverDbInterface";
import {
    getUsersInterestsAsArray,
    getWeekStartingDateAsString,
    parseAvailabilityDocId
} from "@/utils/client_side/helpers";
import {admin_db} from "@/firebase/server_side/firebase_admin_init";
import {sendText} from "@/utils/server_side/twillioInterface";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await sendText('+14156911508', 'This is a test text message');
    return res.status(200).json({message: 'done'});

}
