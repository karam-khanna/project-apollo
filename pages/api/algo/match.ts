import {NextApiRequest, NextApiResponse} from "next";
import {AlgoMatchReturn, Interest, Invitation, Timeslots} from "@/interfaces";
import {
    addInviteToDb,
    findAvailableForTimeAndInterest,
    getUserFromDb,
    updateInviteStatus
} from "@/utils/server_side/serverDbInterface";
import {getWeekStartingDate, getWeekStartingDateAsString, parseInviteDocId} from "@/utils/client_side/helpers";
import {undefined} from "zod";
//import {sendText} from "@/utils/server_side/twillioInterface";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client_side/firebase_init";
import axios from "axios";
import twilio from 'twilio';

const client = twilio(process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID, process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN);

const sendText = async (req:any, res:any) => {

    const {to, message} = JSON.parse(req.body);

    try {
        await client.messages.create({
            body: message,
            to, // The recipient's phone number
            from: '+18559620462', // Your Twilio phone number
          })
          res.status(200).json({message: 'Text sent'});

    } catch (error){
        console.log('Error sending text:', error);
        res.status(500).json({error: 'Text not sent'});
    }

}

function format(name: string) {
    // Split the name before the first uppercase letter
    const words = name.split(/(?=[A-Z])/);
  
    // Capitalize the first letter of each word and join them with spaces
    const formattedName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
    return formattedName;
  }

export default async function matchSlot(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const reqBody = req.body;
        let date = new Date();
        let shouldText = false;
        if (reqBody && reqBody.shouldText && reqBody.shouldText === true) {
            shouldText = true;
        }

        if (reqBody && reqBody.date) {
            date = new Date(reqBody.date);
        } else {
            date = getWeekStartingDate(new Date());
        }

        let limit = 0;
        if (reqBody && reqBody.limit) {
            limit = reqBody.limit;
        } else {
            limit = 0
        }

        if (date.getDay() !== 1) {
            return res.status(400).json({error: 'Invalid date: not a Monday'});
        }

        const results: AlgoMatchReturn[] = [];
        const currentDate = new Date(date); // Create a new Date object for each iteration
        const dateString = currentDate.toDateString();

        for (const timeslot in Timeslots) {
            if (!Object.values(Timeslots).includes(timeslot as any)) {
                continue;
            }

            for (const interest in Interest) {
                if (!Object.values(Interest).includes(interest as any)) {
                    continue;
                }
                const matches = await findAvailableForTimeAndInterest(timeslot as Timeslots, currentDate, interest as Interest);

                // if we have matches for this timeslot and interest, add it to the results
                if (matches.length >= limit) {
                    results.push({
                        date: dateString,
                        timeslot: timeslot as Timeslots,
                        interest: interest as Interest,
                        matches
                    });
                    await setDoc(doc(db, 'chats', interest + "-" + timeslot), {'users': []})
                    try {
                        const response = await axios.put(
                            "https://api.chatengine.io/chats/",
                            {
                                "usernames": ["Mutuals Admin"],
                                "title": interest + "-" + timeslot,
                                "is_direct_chat": false
                            },
                            {
                                "headers": {
                                    "project-id": process.env.NEXT_PUBLIC_CHAT_PROJECT as string,
                                    "user-name": "Mutuals Admin",
                                    "user-secret": "z468vf3TWVMVOnLst4fB4b1z4T82"
                                }
                            }
                        )
                        await setDoc(doc(db, 'chats', interest + "-" + timeslot), {'users': [], 'chatid': response.data.id});
                    }
                    catch (error) {
                        res.status(400).json(error)
                        return
                    }
                }
            }
        }
        const invitations: Invitation[] = [];
        for (const result of results) {
            for (const user of result.matches) {
                let toPush: Invitation = {
                    date: getWeekStartingDateAsString(new Date(result.date), true),
                    id: parseInviteDocId(user.id, result.timeslot, result.date),
                    interest: result.interest,
                    status: "notSent",
                    timeslot: result.timeslot,
                    userId: user.id,
                }
                // invitation will get set to whats in the db if its already there
                const invitation = await addInviteToDb(toPush);
                if (invitation) {
                    invitations.push(invitation);
                }
            }
        }

        if (shouldText) {
            for (const invitation of invitations) {
                if (invitation.status === "notSent") {
                    // get the user from the db
                    const user = await getUserFromDb(invitation.userId);
                    if (!user) {
                        continue;
                    }
                    if (!user.phone || user.phone === "") {
                        console.log('user has no phone number', user.email);
                        continue;
                    }

                    // send the text message
                    await sendText(user.phone, `You have been invited to play ${invitation.interest} on ${format(invitation.timeslot)}. Head into Mutuals to accept or decline.`);

                    // update the db
                    await updateInviteStatus(invitation.id, "sent");
                }

            }
        }


        res.status(200).json(results);
    } else {
        res.status(400).json({error: 'Only takes GET'});
    }
}
