import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle";
import { Fragment, useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { firebase_auth } from "@/firebase/client_side/firebase_init";
import { format, startOfWeek, endOfWeek } from 'date-fns';
import InvitationsPane from '@/components/invites';
import EventsComponent from '@/components/events';
import { EventsContext } from '@/context/EventsContext';
import { Invitation } from '@/interfaces';
import useSWR from 'swr';
import { fetcherWithNoAuthToken } from '@/utils/client_side/helpers';

const inter = Inter({ subsets: ['latin'] })


function SignedScreen() {
    const { user, setUser } = useContext(UserContext);
    const { userAuth, setUserAuth } = useContext(UserContext);
    const [events, setEvents] = useState<Invitation[] | null>(null);
    const router = useRouter();
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const currentHour = currentDate.getHours(); // 0 to 23
    const isCalendarButtonVisible = currentDay == 1 || currentDay == 2 || currentDay == 3 || (currentDay == 4 && currentHour <= 12);
    const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Adjust weekStartsOn based on your locale
    const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    const formattedStartDate = format(startOfWeekDate, 'MMMM d');
    const formattedEndDate = format(endOfWeekDate, 'MMMM d');

    return (<div className={"flex justify-center"}>
        {/* Left sidebar (Navigation) */}
        {user
            ?
            //className="w-1/5 h-screen flex flex-col items-start justify-between p-4 pt-32"
            <Fragment> 
                <div className={"flex flex-col gap-2"}>
                    {/* {isCalendarButtonVisible && <Button onClick={() => router.push('/calendarpage').then()}>Calendar Page</Button>}
                    <Button onClick={() => router.push('/profile').then()}>Profile</Button>
                    <Button onClick={() => router.push('/chat').then()}>Chat</Button>
                    <Button onClick={() => router.push('/invitations').then()}>Invitations</Button>
                    <Button onClick={() => router.push('/myevents').then()}>My Events</Button> */}
                </div>
            </Fragment>
            :
            <>
                <Button onClick={() => router.push('/login').then()}>Log In</Button>
                <Button onClick={() => router.push('/signup').then()}>Sign Up</Button>
            </>
        }

        {/*Main Content */}
        <EventsContext.Provider value={{events: events, setEvents: setEvents}}>
        <div className={"flex flex-col items-center justify-center pt-16 gap-9 overflow-auto"}>
            <h1 className="text-6xl font-bold text-center">Welcome back {user?.firstName}!</h1>
            <InvitationsPane />

            <CardTitle className='flex justify-center items-center mt-3'>Upcoming Events: {formattedStartDate} - {formattedEndDate}</CardTitle>


                {/* Weekly Calendar */}
                <EventsComponent />
        </div>
        </EventsContext.Provider>


    </div>)
}

function NotSignedScreen() {
    const router = useRouter();
    return (<div className="mx-auto text-center justify-center h-screen items-center ">
        <h1 className="text-6xl font-bold text-center mt-4 mb-4">Welcome to Mutuals!</h1>

        <div className="w-full p-3 pt-0 sm:p-0 sm:w-2/4 pl-6 sm:pl-0 text-center mx-auto mt-4 mb-4">
            <h2 className="text-sm sm:text-xl text-muted-foreground font-normal text-left sm:text-center">
                Kindred Interests, Memorable Meets: Connecting You to Your Ideal Events.
            </h2>
        </div>

        <div>
            <Button className="mr-8" onClick={() => router.push('/login').then()}>Log In</Button>
            <Button onClick={() => router.push('/signup').then()}>Sign Up</Button>
        </div>
    </div>)
}

export default function Home() {
    const { user, setUser } = useContext(UserContext);
    const { userAuth, setUserAuth } = useContext(UserContext);
    const router = useRouter();
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const currentHour = currentDate.getHours(); // 0 to 23
    const isCalendarButtonVisible = currentDay == 1 || currentDay == 2 || currentDay == 3 || (currentDay == 4 && currentHour <= 12);
    const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Adjust weekStartsOn based on your locale
    const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    const formattedStartDate = format(startOfWeekDate, 'MMMM d');
    const formattedEndDate = format(endOfWeekDate, 'd');

    return (
        <>
            {user ? SignedScreen() : NotSignedScreen()}
        </>
    )

}
