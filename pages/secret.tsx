import { Inter } from 'next/font/google'
import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { useEffect } from 'react';
import { firebase_auth } from "@/firebase/client_side/firebase_init";
import { Button } from '@/components/ui/button';
import { getMyChats } from '@/utils/client_side/chatUtils';
import axios from 'axios';
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const { user, setUser } = useContext(UserContext);
    const [destination, setDestination] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("")
    const [text, setText] = useState("")

    //if user is logged in, set firebase email as the user's email
    useEffect(() => {
        const fetchUserEmail = async () => {
            const currentUser = firebase_auth.currentUser;
            if (currentUser) {
                const userEmail = currentUser.email || "";
                setDestination(userEmail);
            }
        };

        fetchUserEmail(); // Call the function to set the destination state variable when the component mounts
    }, []);

    //Sample messages for notifications
    const eventReminder = `
    Hello ${user?.firstName || ''} ${user?.lastName || ''},

    Get hyped for BASKETBALL. We wanted to remind you that your basketball event is coming up in the next few days:

    Event Details:
    Date: [Event Date]
    Time: [Event Time]
    Location: [Event Location]

    Have fun balling! If you want to connect with your group head to the app:)

    Your Mutual,
    Devkam
    `;

    const calendarLive = `
Hello ${user?.firstName || ''} ${user?.lastName || ''},

Our calendar is LIVE. Head over to the app to mark your availability for this weekend!

Your Mutual,
Devkam
    `;

    const acceptEvent = `
Hello ${user?.firstName || ''} ${user?.lastName || ''},

You've been added to an event for this weekend. Head to the app to accept your event!

Your Mutual,
Devkam
`;

    //set message and subject to random option for testing purposes
    const messageOptions = [eventReminder, calendarLive, acceptEvent];
    const subjectOptions = ['Upcoming Events', 'Calendar now Live', 'Event Posted'];

    const randomIndex = Math.floor(Math.random() * messageOptions.length);
    const [message, setMessage] = useState(messageOptions[randomIndex]);
    const [subject, setSubject] = useState(subjectOptions[randomIndex]);


    //send email to user


    const sendText = (sendto: string, message: string) => {
        fetch('/api/sendText', {
            method: 'POST',
            body: JSON.stringify({ to: sendto, message })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    function mapChats(data: any) {
        return data.title
    }

    function getPeople(data: any) {
        const people: any = []
        data.forEach((chat: { people: any[]; }) => {
            const collect: any[] = []
            chat.people.forEach((something: { person: { username: any; }; }) => {
                collect.push(something.person.username)
            })
            people.push(collect)
        })
        return people
    }
    const testAPI = async () => {
        function getPeople(data: any) {
            let collect: { [key: string]: any } = {};
            data.forEach((chat: { title: any; people: { person: { username: any; }; }[]; }) => {
                const title: string = chat.title;
                const people: any = [];
                chat.people.forEach((something: { person: { username: any; }; }) => {
                    people.push(something.person.username)
                })
                collect[title] = people
            })
            return collect
        }
        try {
            axios({
                method: 'get',
                url: 'https://api.chatengine.io/chats/',
                headers: {
                    'project-id': process.env.NEXT_PUBLIC_CHAT_PROJECT as string,
                    'user-name': user?.firstName + " " + user?.lastName,
                    'user-secret': user?.id as string
                }
            })
                .then((response) => { console.log(getPeople(response.data)) })
                .catch((error) => { throw new Error(error) });
        }
        catch (error) {
            console.log(error)
            throw new Error("YEAHHHH")
        }
    }
    return (
        <div>
            <Button onClick={testAPI}>Test API</Button>

            <div className={"flex flex-col items-center justify-center pt-16 gap-9"}>
                <h1 className="text-6xl font-bold text-center">Secret Page!</h1>
                <p>Here we will put admin stuff. Later will add some rules here so only admins can visit this page
                    and take it off the header</p>
                <div className={"flex flex-col items-center"}>
                    <h1 className="text-6xl font-bold text-center">User Info</h1>
                    <p>First Name: {user?.firstName}</p>
                    <p>Last Name: {user?.lastName}</p>
                </div>
            </div>


            <div className="flex flex-col items-center justify-center pt-16 gap-1">
                <h1 className="text-2xl font-semibold mb-2">Phone Notification Testing</h1> {/* Header */}
                <form className="flex flex-col mx-auto w-full max-w-screen-md md:w-96"></form>
                <input type="text" placeholder="phone" value={phoneNumber}
                    onChange={(e) => (setPhoneNumber(e.target.value))} className="bg-black border rounded p-2" />
                <br />
                <input type="text" placeholder="text" value={text}
                    onChange={(e) => (setText(e.target.value))} className="bg-black border rounded p-2" />
                <br />

                <button onClick={() => sendText(phoneNumber, text)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded">Send
                    Text
                </button>
            </div>

        </div>

    )
}
