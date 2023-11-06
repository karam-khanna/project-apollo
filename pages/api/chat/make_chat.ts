import React from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client_side/firebase_init";
import { getUserFromDb } from "@/utils/server_side/serverDbInterface"
import { makeChatUser } from "@/utils/client_side/chatUtils";
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from "next";

async function addChat(chatid: string) {
    const docRef = doc(db, 'chats', chatid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const chat = req.body.chatid
        const cnnct = await addChat(chat)
        if (!cnnct) {
            res.status(400).json({ "error": "MEOW" })
            return;
        }

        const secrets = cnnct.users
        let emails: string[] = []
        for (const secret of secrets) {
            var user = await getUserFromDb(secret)
            if (user) {
                var email = user.email
                emails.push(email)
            }
            else {
                emails.push("ERROR")
            }
        }
        if (!process.env.NEXT_PUBLIC_CHAT_PROJECT) {
            res.status(400).json("no project ID")
            return;
        }
        try {
            const response = await axios.put(
                "https://api.chatengine.io/chats/",
                {
                    "usernames": emails,
                    "title": chat,
                    "is_direct_chat": false
                },
                {
                    "headers": {
                        "project-id": process.env.NEXT_PUBLIC_CHAT_PROJECT,
                        "user-name": emails[0],
                        "user-secret": secrets[0]
                    }
                }
            )
            res.status(200).json(response.data)
            return;
        }
        catch (error) {
            res.status(400).json(error)
            return;
        }
    } else {
        res.status(400).json("Method unsupported");
        return;
    }

}
