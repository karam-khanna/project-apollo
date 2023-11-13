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
import {sendText} from "@/utils/server_side/twillioInterface";

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
                    await sendText(user.phone, `You have been invited to play ${invitation.interest} on ${invitation.timeslot}. Head into Mutuals to accept or decline.`);

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
