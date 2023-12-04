import { UserContext } from "@/context/UserContext";
import { db } from "@/firebase/client_side/firebase_init";
import { Invitation } from "@/interfaces";
import { fetcherWithNoAuthToken } from "@/utils/client_side/helpers";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { Button } from "./ui/button";
import router from "next/router";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { EventsContext } from "@/context/EventsContext";

interface Event {
    Day: string;
    Time: string;
    Activity: string;
    NumberOfPeople: string;
    GroupChat: JSX.Element;
}

function format(name: string) {
    // Split the name before the first uppercase letter
    const words = name.split(/(?=[A-Z])/);

    // Capitalize the first letter of each word and join them with spaces
    const formattedName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return formattedName;
}
export default function EventsComponent() {
    const { user } = useContext(UserContext);
    const { events, setEvents } = useContext(EventsContext);
    const [eventDisplays, setEventDisplays] = useState<Event[]>([]);
    const [eventURLS, setEventURLS] = useState([])
    useEffect(() => {
        // create a new array of events
        if (events) {
            // filter to only events that are accepted

            const eventChatId = async (event: Invitation) => {
                const docRef = await getDoc(doc(db, "chats", event.interest + "-" + event.timeslot))
                const docSnap = docRef.data()
                if (docSnap) {
                    return docSnap.chatid
                }
            }
            const eventUserList = async (event: Invitation) => {
                if (String(event.interest) === "demo") {
                    const docRef = await getDoc(doc(db, "chats", "Everyone's Here!"))
                    const docSnap = docRef.data()
                    if (docSnap) {
                        return docSnap.users.length
                    }
                }
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
                    events.map(async (event) => {
                        const chatId = await fetchChatId(event);
                        const len = await fetchUserList(event)
                        return {
                            Day: event.date,
                            Time: format(event.timeslot.toString()),
                            Activity: event.interest.toString(),
                            NumberOfPeople: len,
                            GroupChat: (
                                <Button onClick={() => router.push(`/chat?chatid=${chatId}`).then()}>Chat</Button>
                            ),
                        };
                    })
                );
                setEventDisplays(newEvents);
            };

            createNewEvents();
        }
    }, [events]);
    const fridayEvents = eventDisplays.filter(item => item.Time.toLowerCase().includes("friday"))
    const saturdayEvents = eventDisplays.filter(item => item.Time.toLowerCase().includes("saturday"))
    const sundayEvents = eventDisplays.filter(item => item.Time.toLowerCase().includes("sunday"))
    interface DaySectionProps {
        dayName: string;
        events: Event[];
    }
    const DaySection: React.FC<DaySectionProps> = ({ dayName, events }) => (
        <div className="scrollable-section flex-shrink-1" style={{ height: '400px', overflowY: 'auto' }}>
            <div className="flex flex-col items-center space-y-3">
                <div className="flex sticky top-0 bg-pink p-2 justify-center items-center w-200px rounded-md">
                    <h1 className='text-white font-bold'>{dayName}</h1>
                </div>
                {events.map((event) => (
                    <Card key={event.Activity + " " + event.Time} className="w-[200px]">
                        <CardHeader>
                            <CardTitle>{event.Activity.charAt(0).toUpperCase() + event.Activity.substring(1)}</CardTitle>
                            <CardDescription>{format(event.Time)}</CardDescription>
                            {event.GroupChat}
                        </CardHeader>
                        <div className="flex justify-center items-center mt-2 text-gray-500">
                            <span>{event.NumberOfPeople} confirmed.</span>
                        </div>
                    </Card>


                ))}
            </div>
        </div>
    );
    return (
        <div className="App pt-8">
            <div className="flex flex-row items-center space-x-2 flex-shrink-1 space-y-0">
                <DaySection dayName="FRIDAY" events={fridayEvents} />
                <DaySection dayName="SATURDAY" events={saturdayEvents} />
                <DaySection dayName="SUNDAY" events={sundayEvents} />
            </div>
        </div>
    )

}