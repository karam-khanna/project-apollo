import { NextApiRequest, NextApiResponse } from "next";
import { getInvitesForUser, getUserFromDb, updateInviteStatus } from "@/utils/server_side/serverDbInterface";
import { db } from "@/firebase/client_side/firebase_init";
import { getDoc, doc, setDoc } from "firebase/firestore";
import axios from "axios"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // update invite status
        const userId = req.query.userId as string;
        const invitationId = req.query.invitationId as string;
        if (req.body !== "accept" && req.body !== "decline") {
            res.status(400).json({ error: 'Invalid body' });
            return;
        }
        try {
            await updateInviteStatus(invitationId, req.body as "accept" | "decline");
            if (req.body == 'accept') {
                const inviteInfo = await getDoc(doc(db, "Invitations", invitationId))
                const inviteData = inviteInfo.data()
                const chatname = inviteData?.interest + "-" + inviteData?.timeslot
                const user = await getUserFromDb(userId)
                const uname = user?.firstName + " " + user?.lastName
                const chatRef = doc(db, "chats", chatname)
                const chatInfo = await getDoc(chatRef)
                const chatData = chatInfo.data()
                const chatId = chatData?.chatid
                const response = await axios.post(
                    `https://api.chatengine.io/chats/${chatId}/people/`,
                    {
                        "username": uname
                    },
                    {
                        "headers": {
                            "project-id": process.env.NEXT_PUBLIC_CHAT_PROJECT as string,
                            "user-name": "Mutuals Admin",
                            "user-secret": "z468vf3TWVMVOnLst4fB4b1z4T82"
                        }
                    }
                )
                if (chatData && !chatData.users.includes(uname)) {
                    chatData.users.push(uname)
                }
                await setDoc(chatRef, chatData)

            }
        }
        catch (error) {
            res.status(400).json(error)
            return;
        }

        console.log(req.body);
        res.status(200).json({
            message: 'No invites found'
        });


    } else {
        res.status(400).json({ error: 'Only takes POST' });
    }
}