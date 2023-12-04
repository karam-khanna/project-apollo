import { db } from "@/firebase/client_side/firebase_init";
import { Invitation } from "@/interfaces";
import { getWeekStartingDateAsString, parseInviteDocId } from "@/utils/client_side/helpers";
import { addInviteToDb } from "@/utils/server_side/serverDbInterface";
import { deleteDoc, doc } from "firebase/firestore";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const result = req.body;
    await deleteDoc(doc(db, "Invitations", result.id + "-demo"))
    console.log("deleted document")
    let toPush: Invitation = {
        date: getWeekStartingDateAsString(new Date(result.date), true),
        id: result.id + "-demo",
        interest: result.interest,
        status: "notSent",
        timeslot: result.timeslot,
        userId: result.id,
    }
    // invitation will get set to whats in the db if its already there
    try {
        const invitation = await addInviteToDb(toPush)
        res.status(200).json(invitation)
        return
    }
    catch(error){
        res.status(400).json("failed")
    }
}