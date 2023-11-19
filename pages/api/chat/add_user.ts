import React from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client_side/firebase_init";
import { getUserFromDb } from "@/utils/server_side/serverDbInterface"
import { makeChatUser } from "@/utils/client_side/chatUtils";
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const addto = req.body.chatid
    const user = await getUserFromDb(req.body.userid)
    if (user) {
        const uname = user.firstName + " " + user.lastName
        const secret = user.id
        try {
            await axios.post(
                `https://api.chatengine.io/chats/${addto}/people/`,
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
            res.status(200).json(`user ${uname} added to ${addto}`)
        }
        catch (error){
            res.status(400).json(error)
            return
        }
    }
}