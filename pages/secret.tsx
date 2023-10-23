import {Inter} from 'next/font/google'
import {useContext, useState} from "react";
import {UserContext} from "@/context/UserContext";
import {useEffect} from 'react';
import {firebase_auth} from "../firebase/client_side/firebase";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const {user, setUser} = useContext(UserContext);
    const [destination, setDestination] = useState("");
    //const [message, setMessage] = useState("")
    //const [subject, setSubject] = useState("")

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
    const sendEmail = (sendto: string, message: string, subject: string) => {
        fetch('/api/sendEmail', {
            method: 'POST',
            body: JSON.stringify({to: sendto, subject, message})
        })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
    };


    return (
            <div>
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
                    <h1 className="text-2xl font-semibold mb-2">Email Notification Testing</h1> {/* Header */}
                    <form className="flex flex-col mx-auto w-full max-w-screen-md md:w-96"></form>
                    <input type="text" placeholder="email" value={destination}
                           onChange={(e) => (setDestination(e.target.value))} className="bg-black border rounded p-2"/>
                    <br/>
                    <input type="text" placeholder="subject" value={subject}
                           onChange={(e) => (setSubject(e.target.value))} className="bg-black border rounded p-2"/>
                    <br/>
                    <input type="text" placeholder="text" value={message} onChange={(e) => (setMessage(e.target.value))}
                           className="bg-black border rounded p-2"/>
                    <br/>

                    <button onClick={() => sendEmail(destination, message, subject)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded">Send
                        Email
                    </button>
                </div>
            </div>

    )
}
