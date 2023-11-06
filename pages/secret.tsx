import {Inter} from 'next/font/google'
import {useContext, useState} from "react";
import {UserContext} from "@/context/UserContext";
import {useEffect} from 'react';
import {firebase_auth} from "@/firebase/client_side/firebase_init";
import { useRouter } from 'next/router';
import {admin_db} from "@/firebase/server_side/firebase_admin_init";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";


const inter = Inter({subsets: ['latin']})

export default function Home() {
    /*
    //admin database:
    var db = admin_db; //need the .env to run with no errors
    // Access a specific collection in the database
    const userCollection = db.collection('Users');

    // Retrieve user phone number from the user collection where the field 'phone' exists
    userCollection
    .where('phone', '!=', null) // Filters documents where 'phone' field is not null
    .get()
    .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const phoneNumber = userData.phone;
        console.log('User Phone Number:', phoneNumber);
    });
    })
    .catch((error) => {
    console.error('Error getting documents:', error);
    });

*/

    const {user, setUser} = useContext(UserContext);
    const [destination, setDestination] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(""); //set phone number to current user
    const [text, setText] = useState("");

    const router = useRouter();

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
    Hello ${user?.firstName || ''},

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
    Hello ${user?.firstName || ''},

Our calendar is LIVE. Head over to the app to mark your availability for this weekend!

    Your Mutual,
    Devkam
    `;

    const acceptEvent = `
    Hello ${user?.firstName || ''},

You've been added to an event for this weekend.

    Event Details:
        Date: [Event Date]
        Time: [Event Time]
        Location: [Event Location]

Head to the app to accept your event or reply 1 to accept or 2 to decline!

    Your Mutual,
    Devkam
    `;

//set message and subject to random option for testing purposes
    const messageOptions = [eventReminder, calendarLive, acceptEvent];
    const subjectOptions = ['Upcoming Events', 'Calendar now Live', 'Event Posted'];

    //For Event Posted, save response (1 or 2)




    const sendText = (sendto: string, message: string) => {
        fetch('/api/sendText', {
            method: 'POST',
            body: JSON.stringify({to: sendto, message})
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
                        <p>Phone Number: {user?.phone}</p>
                    </div>
                
                </div>


                <div className="flex flex-col items-center justify-center pt-16 gap-1">
                    <h1 className="text-2xl font-semibold mb-2">Phone Notification Testing</h1> {/* Header */}
                    <form className="flex flex-col mx-auto w-full max-w-screen-md md:w-96"></form>
                    <input type="text" placeholder="phone" value={phoneNumber}
                           onChange={(e) => (setPhoneNumber(e.target.value))} className="bg-black border rounded p-2"/>
                    <br/>

                    <button onClick={() => sendText(phoneNumber, eventReminder)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded">Send Event Reminder
                        Text
                    </button>
                    <button onClick={() => sendText(phoneNumber, calendarLive)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded">Send Calendar Live
                        Text
                    </button>
                    <button onClick={() => sendText(phoneNumber, acceptEvent)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded">Send Accept Event
                        Text
                    </button>
                </div>

            </div>

    )
}
