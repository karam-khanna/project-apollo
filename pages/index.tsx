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

interface PulsingTextStyle extends React.CSSProperties {
    animation: string;
  }


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
            <h1 className="text-6xl font-bold text-center">Welcome back, {user?.firstName}!</h1>
            <CardTitle className='flex justify-center items-center'>Invitations:</CardTitle>
            <InvitationsPane/>
            <CardTitle className='flex justify-center items-center mt-3 text-center'>Upcoming Events: {formattedStartDate} - {formattedEndDate}</CardTitle>

                {/* Weekly Calendar */}
                <EventsComponent />
        </div>
        </EventsContext.Provider>


    </div>)
}
//Displaying welcome message and login/signup options 
function NotSignedScreen() {
    const router = useRouter();
  
    const calculateGradientPosition = (letterIndex: number) => {
      return `${letterIndex * 10}% 50%`; // Adjust the multiplier to control the speed
    };
  
    const pulsingTextStyle: PulsingTextStyle = {
      background: 'linear-gradient(45deg, #F43F5E, #FF8B9F)',
      backgroundSize: '200% 200%',
      animation: 'pulse 3s infinite',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      fontSize: '5rem',
      textAlign: 'center', // Explicitly set to 'center'
      lineHeight: '1.2',
    };
  
    const largerBoldTextStyle = {
      fontSize: '1.2rem',
      fontWeight: 'bold',
    };
  
    const largerMutualsStyle = {
      fontSize: '5rem',
      fontWeight: 'bold',
    };
  
    const widerTextStyle = {
      width: '15rem',
    };
  
    const smallerTextStyle = {
      fontSize: '0.9rem',
      fontWeight: 'normal',
    };
  
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <style jsx>{`
          @keyframes pulse {
            0% { background-position: ${calculateGradientPosition(0)}; }
            50% { background-position: ${calculateGradientPosition(10)}; }
            100% { background-position: ${calculateGradientPosition(20)}; }
          }
        `}</style>
  
        <img src="/mutuals.svg" alt="Your Image Alt Text" style={{ width: '100px', height: '100px' }} />
  
        <h1 className="text-4xl font-extrabold mb-4" style={{ ...pulsingTextStyle, animation: 'pulse 3s infinite' }}>
          Welcome to<br /><span style={largerMutualsStyle}>Mutuals</span>!
        </h1>
  
        <p className="text-lg sm:text-xl font-bold text-gray-500 mb-2 text-center" style={{ ...largerBoldTextStyle, ...widerTextStyle }}>
          Connecting You to Your Ideal Events.
        </p>
  
        <p className="text-sm sm:text-base text-gray-500 mb-6 text-center" style={{ ...smallerTextStyle, ...widerTextStyle }}>
          Our goal with this app is to connect people with like-minded individuals for activities that they like to take part in.
          However, Mutuals doesn’t just plan events; it creates opportunities for individuals to share experiences and make lasting memories.
        </p>
  
        <div className="space-x-4">
          <button onClick={() => router.push('/login')}>Log In</button>
          <button onClick={() =>  window.location.href =('/signup')}>Sign Up</button>
        </div>
      </div>
    );
  }
  
 
// Rendering content based on user context and current date 
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
