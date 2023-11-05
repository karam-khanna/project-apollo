import axios from 'axios'
import { NextApiRequest, NextApiResponse } from "next";
import { Interest, timeslots, User, UserAvailability } from "@/interfaces";
import { getUserFromDb } from "@/utils/server_side/serverDbInterface";
import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { admin_db } from "@/firebase/server_side/firebase_admin_init";

function getChatProfile(email: string, id: string, privateID: string | undefined): Promise<string> {
    if (!privateID) {
        return Promise.reject("NOPRIVATEKEY");
    }
    return axios.put(
        'https://api.chatengine.io/users/',
        {
            'username': email,
            'secret': id
        },
        {
            headers: {
                'PRIVATE-KEY': privateID
            }
        }
    ).then((response) => {
        return response.data.id;
    }).catch((error) => {
        return "brudda";
    });
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        var reqBody = req.body;
        if (!reqBody.userid) {
            res.status(400).json({ error: 'Missing user' });
            return;
        }
        const user = await getUserFromDb(reqBody.userid as string);
        if (!user || !user.onboarded) {
            res.status(400).json({ error: "Error -- user not present or not onboarded" });
            return;
        }
        if (!process.env.NEXT_PUBLIC_CHAT_PRIVATE) {
            res.status(400).json({ error: "Error -- problem with chat connection API" });
            return;
        }
        try {
            const response = await axios.put(
                'https://api.chatengine.io/users/',
                {
                    'username': user.email,
                    'secret': reqBody.userid as String
                },
                {
                    headers: {
                        'PRIVATE-KEY': process.env.NEXT_PUBLIC_CHAT_PRIVATE
                    }
                }
            );

            const chatconnect = response.data.id;
            const chatResponse = await axios.patch(
                `https://api.chatengine.io/users/${chatconnect}`,
                {
                    'first_name': user.firstName,
                    'last_name': user.lastName
                },
                {
                    headers: {
                        'PRIVATE-KEY': process.env.NEXT_PUBLIC_CHAT_PRIVATE
                    }
                }
            );

            res.status(200).json(chatResponse.data);
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

