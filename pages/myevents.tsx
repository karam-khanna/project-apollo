import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useSWR from "swr";
import {Invitation} from "@/interfaces";
import {fetcherWithNoAuthToken} from "@/utils/client_side/helpers";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "@/context/UserContext";

// let events = [
//     {
//         Day: "Friday",
//         Time: "Evening",
//         Activity: "Poker",
//         NumberOfPeople: "6/8",
//         GroupChat: <a href="https://www.emory.edu/home/index.html">Join GroupChat</a>,
//     },
//     {
//         Day: "Friday",
//         Time: "Late Night",
//         Activity: "Poker",
//         NumberOfPeople: "8/8",
//         GroupChat: <a href="https://www.emory.edu/home/index.html">Join GroupChat</a>,
//     },
// ]

export default function TableDemo() {
    const {user} = useContext(UserContext);
    const {data: invitations, error} = useSWR<Invitation[]>(
            user ? `/api/users/${user.id}/invitations` : null,
            fetcherWithNoAuthToken,
    );
    const [events, setEvents] = useState([]);
    console.log(invitations, "invitations")

    useEffect(() => {
        // create a new array of events
        if (invitations) {
            // filter to only events that are accepted
            const accepts = invitations.filter((event) => {
                return event.status === "accept"
            });

            if (accepts.length === 0) {
                setEvents([]);
                return;
            }
            let newEvents = accepts.map((event) => {
                return {
                    Day: event.date,
                    Time: event.timeslot.toString(),
                    Activity: event.interest.toString(),
                    NumberOfPeople: "69",
                    GroupChat: <a href="https://www.emory.edu/home/index.html">Join GroupChat</a>,
                }
            });

            // @ts-ignore
            setEvents(newEvents ?? []);
        }


    }, [invitations]);
    console.log(events, "events")
    if (!invitations) {
        return (<div>Loading...</div>)
    }
    if (events.length === 0) {
        return (<div>No events accepted!</div>)
    }
    return (
            <div className="flex flex-col items-center justify-center pt-16 gap-9">
                <h1 className="text-6xl font-bold text-center"> My Events </h1>
                <Table>
                    <TableCaption>A list of your upcoming events.</TableCaption>
                    <TableHeader>
                        <TableRow className="justify-center">
                            <TableHead className="text-pink cursor-pointer ml-2 font-bold ">Day</TableHead>
                            <TableHead className="text-pink cursor-pointer ml-2 font-bold">Time</TableHead>
                            <TableHead className="text-pink cursor-pointer ml-2 font-bold">Activity</TableHead>
                            <TableHead className="text-pink cursor-pointer ml-2 font-bold">Confirmed </TableHead>
                            <TableHead className="text-pink cursor-pointer ml-2 font-bold">Group Chat</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((events) => (
                                <TableRow key={events.Day}>
                                    <TableCell>{events.Day}</TableCell>
                                    <TableCell>{events.Time}</TableCell>
                                    <TableCell>{events.Activity}</TableCell>
                                    <TableCell>{events.NumberOfPeople}</TableCell>
                                    <TableCell>{events.GroupChat}</TableCell>
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
    )
}
  