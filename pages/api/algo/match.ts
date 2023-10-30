import {NextApiRequest, NextApiResponse} from "next";
import {AlgoMatchReturn, Interest, Timeslots} from "@/interfaces";
import {findAvailableForTimeAndInterest} from "@/utils/server_side/serverDbInterface";
import {getWeekStartingDate, getWeekStartingDateAsString} from "@/utils/client_side/helpers";

export default async function matchSlot(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const reqBody = req.body;
        let date = new Date();

        if (reqBody && reqBody.date) {
            date = new Date(reqBody.date);
        } else {
            date = getWeekStartingDate(new Date());
        }

        if (date.getDay() !== 1) {
            return res.status(400).json({error: 'Invalid date: not a Monday'});
        }

        const results: AlgoMatchReturn[] = [];
        const currentDate = new Date(date); // Create a new Date object for each iteration
        const dateString = currentDate.toDateString();
        console.log(dateString);

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
                if (matches.length > 0) {
                    results.push({
                        date: dateString,
                        timeslot: timeslot as Timeslots,
                        interest: interest as Interest,
                        matches
                    });
                }
            }
        }
        res.status(200).json(results);
    } else {
        res.status(400).json({error: 'Only takes GET'});
    }
}
