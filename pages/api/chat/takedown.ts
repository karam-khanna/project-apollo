import React from "react";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/client_side/firebase_init";
import { getUserFromDb } from "@/utils/server_side/serverDbInterface"
import { makeChatUser } from "@/utils/client_side/chatUtils";
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.headers.passkey != process.env.NEXT_PUBLIC_CHAT_PRIVATE as string){
        res.status(500).json("Permission denied")
    }
    if (req.method == "DELETE") {
        try {
            const response = await axios({
                url: "https://api.chatengine.io/chats/",
                method: "GET",
                headers: {
                    "project-id": process.env.NEXT_PUBLIC_CHAT_PROJECT as string,
                    "user-name": "Mutuals Admin",
                    "user-secret": "z468vf3TWVMVOnLst4fB4b1z4T82"
                }
            })
            const toDelete = response.data.filter((chat: any) => Number(chat.id) != 217340).map((chat: any) => chat.id);
            const delTitles = response.data.filter((chat: any) => chat.title != "Everyone's Here!").map((chat: any) => chat.title );
            const delFromChat = toDelete.map(async (chatid: string) => {
                await axios({
                    url: `https://api.chatengine.io/chats/${chatid}/`,
                    method: "DELETE",
                    headers: {
                        "project-id": process.env.NEXT_PUBLIC_CHAT_PROJECT as string,
                        "user-name": "Mutuals Admin",
                        "user-secret": "z468vf3TWVMVOnLst4fB4b1z4T82"
                    }
                }).then(() => {console.log(`Deleted ${chatid} successfully.`)})
            })
            const delFromDB = delTitles.map(async(title: string) => {
                await deleteDoc(doc(db, "chats", title))
            })
            console.log("Deleted database entries successfully.")
            res.status(200).json(`Complete. Deleted ${response.data.length} chats.`)
            return;
        }
        catch (error) {
            res.status(400).json("error: " + JSON.stringify(error));
            return;
        }
    }
    else {
        res.status(400).json("Not supported method.")
        return
    }
}
