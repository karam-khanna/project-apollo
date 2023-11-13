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
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { firebase_auth } from "@/firebase/client_side/firebase_init";

const inter = Inter({ subsets: ['latin'] })

// React component for the Home page
export default function Home() {
    // Access user information and authentication status from context
    const { user, setUser, userAuth, setUserAuth } = useContext(UserContext);

    // Initialize Next.js router
    const router = useRouter();

    // Get current date and time information
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const currentHour = currentDate.getHours(); // 0 to 23

    // Determine whether the "Calendar Page" button should be visible based on the current day and time
    const isCalendarButtonVisible = currentDay == 1 || currentDay == 2 || currentDay == 3 || (currentDay == 4 && currentHour <= 12);

    return (
        <div className={"flex flex-col items-center justify-center pt-16 gap-9"}>
            {/* Welcome message */}
            <h1 className="text-6xl font-bold text-center">Welcome to Mutuals!</h1>

            {/* Conditional rendering based on user authentication */}
            {user
                ?
                // If user is authenticated, display buttons for different pages and a logout button
                <div className={"flex flex-col gap-2"}>
                    {isCalendarButtonVisible && <Button onClick={() => router.push('/calendarpage').then()}>Calendar Page</Button>}
                    <Button onClick={() => router.push('/profile').then()}>Profile</Button>
                    <Button onClick={() => router.push('/chat').then()}>Chat</Button>
                    <Button onClick={() => router.push('/invitations').then()}>Invitations</Button>
                    <Button onClick={() => router.push('/myevents').then()}>My Events</Button>
                    <Button onClick={() => {
                        firebase_auth.signOut().then((r) => {
                            setUserAuth(null);
                            setUser(null);
                        });
                    }}>Logout</Button>
                </div>
                :
                // If user is not authenticated, display login and signup buttons
                <>
                    <Button onClick={() => router.push('/login').then()}>Log In</Button>
                    <Button onClick={() => router.push('/signup').then()}>Sign Up</Button>
                </>
            }

            {/* Additional content or components can be added here */}

            {/* Theme toggle button */}
            <div className={"flex items-center"}>
                <Label className={"text-xl"}>Light/Dark Toggle</Label>
                <ThemeToggle />
            </div>
        </div>
    )
}
