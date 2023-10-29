import Image from 'next/image'
import {Inter} from 'next/font/google'
import {Button} from "@/components/ui/button";
import Link from 'next/link';
import {useRouter} from 'next/router';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {ThemeToggle} from "@/components/theme-toggle";
import {useContext} from "react";
import {UserContext} from "@/context/UserContext";
import {firebase_auth} from "@/firebase/client_side/firebase_init";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const {user, setUser} = useContext(UserContext);
    const {userAuth, setUserAuth} = useContext(UserContext);
    const router = useRouter();
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const currentHour = currentDate.getHours(); // 0 to 23
    const isCalendarButtonVisible = currentDay == 1 || currentDay == 2 || currentDay == 3|| (currentDay == 4 && currentHour <= 12);

    return (
        <div className={"flex flex-col items-center justify-center pt-16 gap-9"}>
            <h1 className="text-6xl font-bold text-center">Welcome to Mutuals!</h1>
            {user
                ?
                <div className={"flex flex-col gap-2"}>
                    {isCalendarButtonVisible && <Button onClick={() => router.push('/calendarpage').then()}>Calendar Page</Button>}
                    <Button onClick={() => router.push('/profile').then()}>Profile</Button>
                    <Button onClick={() => router.push('/loading').then()}>Loading</Button>
                    <Button onClick={() => router.push('/myevents').then()}>My Events</Button>
                    <Button onClick={
                        () => {
                            firebase_auth.signOut().then((r) => {
                                setUserAuth(null);
                                setUser(null);
                            });
                        }
                    }
                    >Logout</Button>
                </div>
                :
                <>
                    <Button onClick={() => router.push('/login').then()}>Log In</Button>
                    <Button onClick={() => router.push('/signup').then()}>Sign Up</Button>
                </>
            }
            <div className={"flex flex-col items-center justify-center gap-2"}>


            </div>
            {/* <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>This is a sample card</CardTitle>
                    <CardDescription>See a fun weekend event here</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                    <Button>Accept</Button>
                    <Button variant="outline">Decline</Button>
                </CardFooter>
            </Card> */}
            <div className={"flex items-center"}>
                <Label className={"text-xl"}>Light/Dark Toggle</Label>
                <ThemeToggle/>
            </div>
        </div>
    )
}

