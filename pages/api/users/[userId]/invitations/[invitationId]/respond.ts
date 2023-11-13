import {NextApiRequest, NextApiResponse} from "next";
import {getInvitesForUser, updateInviteStatus} from "@/utils/server_side/serverDbInterface";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // update invite status
        const userId = req.query.userId as string;
        const invitationId = req.query.invitationId as string;
        if (req.body !== "accept" && req.body !== "decline") {
            res.status(400).json({error: 'Invalid body'});
            return;
        }
        await updateInviteStatus(invitationId, req.body as "accept" | "decline");

        console.log(req.body);
        res.status(200).json({
            message: 'No invites found'
        });


    } else {
        res.status(400).json({error: 'Only takes POST'});
    }
}