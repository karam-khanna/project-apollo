import {NextApiRequest, NextApiResponse} from "next";
import {getInvitesForUser} from "@/utils/server_side/serverDbInterface";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // get userId
        const userId = req.query.userId as string;
        if (!userId) {
            res.status(400).json({error: 'No userId provided'});
            return;
        }

        // get invites for this week
        const invitations = await getInvitesForUser(userId, new Date());

        res.status(200).json(invitations || {
            message: 'No invites found'
        });

    } else {
        res.status(400).json({error: 'Only takes GET'});
    }
}