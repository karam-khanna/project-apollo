import {NextApiRequest, NextApiResponse} from "next";
import {UserAvailability} from "@/interfaces";
import {getUserFromDb, updateUserAvailability} from "@/utils/server_side/serverDbInterface";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // TODO: verify user id matches with auth tokens
        console.log('update availability')
        const userId = req.query.userId
        let availability;
        try {
            availability = req.body;
        } catch (e) {
            res.status(400).json({error: 'Invalid JSON'});
            return;
        }


        // make sure is type of UserAvailability
        if (!availability) {
            res.status(400).json({error: 'Invalid availability'});
            return;
        }

        const user = await getUserFromDb(userId as string)

        if (!user) {
            res.status(400).json({error: 'No user found'});
            return;
        }

        // cast into userAvailability type
        const userAvailability = availability as UserAvailability;

        // verify we have all the fields
        if (!userAvailability || !userAvailability.userId || !userAvailability.id) {
            res.status(400).json({error: 'Missing fields'});
            return;
        }

        const success = await updateUserAvailability(user!, userAvailability);

        if (success) {
            res.status(200).json(userAvailability);
        } else {
            res.status(500).json({error: 'Error updating availability'});
        }

    } else {
        res.status(400).json({error: 'Only takes POST'});
    }
}
