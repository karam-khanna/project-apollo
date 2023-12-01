import { Invitation } from "@/interfaces";
import { getWeekStartingDateAsString, parseInviteDocId } from "@/utils/client_side/helpers";
import { addInviteToDb, getUserFromDb } from "@/utils/server_side/serverDbInterface";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const results = req.body
    const invitations: any[] = []
    results.forEach(async (result: any) => {
        let toPush: Invitation = {
            date: getWeekStartingDateAsString(new Date(result.date), true),
            id: parseInviteDocId(result.id, result.timeslot, result.date),
            interest: result.interest,
            status: "notSent",
            timeslot: result.timeslot,
            userId: result.id,
        }
        // invitation will get set to whats in the db if its already there
        try {
            const invitation = await addInviteToDb(toPush);
            invitations.push(invitation)
            // const user = await getUserFromDb(results[0].id)
            // if (user) {
            //     await sendText(String(user.phone), `You have been invited to play ${result.interest} on ${format(result.timeslot)}. Head into Mutuals to accept or decline.`);
            // }
        }
        catch (error) {
            res.status(400).json(error)
            return
        }
    })
    res.status(200).json(invitations)
    return
}