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
import { Invitation } from "@/interfaces";
import { fetcherWithNoAuthToken } from "@/utils/client_side/helpers";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client_side/firebase_init";
import { UserContext } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import router from "next/router";

interface Event {
    Day: string;
    Time: string;
    Activity: string;
    NumberOfPeople: string;
    GroupChat: JSX.Element;
}

//Formatting the string to match our requirement 
function format(name: string) {
    // Split the name before the first uppercase letter
    const words = name.split(/(?=[A-Z])/);
  
    // Capitalize the first letter of each word and join them with spaces
    const formattedName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
    return formattedName;
  }

// Using and exporting table feature of shadcn
export default function TableDemo() {
    const { user } = useContext(UserContext);
    const { data: invitations, error } = useSWR<Invitation[]>(
        user ? `/api/users/${user.id}/invitations` : null,
        fetcherWithNoAuthToken,
    );
    const [events, setEvents] = useState<Event[]>([]);
    const [eventURLS, setEventURLS] = useState([])

    useEffect(() => {
        // create a new array of events
        if (invitations) {
            // filter to only events that are accepted
            const accepts = invitations.filter((event) => {
                return event.status === "accept";
            });

            if (accepts.length === 0) {
                setEvents([]);
                return;
            }
            const eventChatId = async (event: Invitation) => {
                const docRef = await getDoc(doc(db, "chats", event.interest + "-" + event.timeslot))
                const docSnap = docRef.data()
                if (docSnap) {
                    return docSnap.chatid
                }
            }
            const eventUserList = async (event: Invitation) => {
                const docRef = await getDoc(doc(db, "chats", event.interest + "-" + event.timeslot))
                const docSnap = docRef.data()
                if (docSnap) {
                    return docSnap.users.length
                }
            }

            const fetchChatId = async (event: Invitation) => {
                const chatId = await eventChatId(event);
                return chatId;
            };

            const fetchUserList = async (event: Invitation) => {
                const uslen = await eventUserList(event);
                return uslen;
            };

            const createNewEvents = async () => {
                const newEvents = await Promise.all(
                    accepts.map(async (event) => {
                        const chatId = await fetchChatId(event);
                        const len = await fetchUserList(event)
                        return {
                            Day: event.date,
                            Time: format(event.timeslot.toString()),
                            Activity: event.interest.toString(),
                            NumberOfPeople: len,
                            GroupChat: (
                                <Button onClick={() => router.push(`/chat?chatid=${chatId}`).then()}>Join GroupChat</Button>
                            ),
                        };
                    })
                );

                setEvents(newEvents);
            };

            createNewEvents();
        }
    }, [invitations]);

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
                    {events.map((events: any) => (
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
