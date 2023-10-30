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

export default async function matchSlot(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        let reqBody = req.body;
        if (!reqBody || !reqBody.timeslot || !reqBody.date || !reqBody.interest) {
            res.status(400).json({error: 'Missing fields'});
            return;
        }

        const timeslot = reqBody.timeslot as Timeslots;
        const date = new Date(reqBody.date);
        const interest = reqBody.interest as Interest;
        // make sure date is valid
        if (isNaN(date.getTime())) {
            res.status(400).json({error: 'Invalid date'});
            return;
        }
        // make sure timeslot is valid
        if (!Object.values(Timeslots).includes(timeslot)) {
            res.status(400).json({error: 'Invalid timeslot'});
            return;
        }
        // make sure interest is valid
        if (!Object.values(Interest).includes(interest)) {
            res.status(400).json({error: 'Invalid interest'});
            return;
        }

        const matches = await findAvailableForTimeAndInterest(timeslot, date, interest);
        res.status(200).json(matches);
    } else {
        res.status(400).json({error: 'Only takes GET'});
    }
}

