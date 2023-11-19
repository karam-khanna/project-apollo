import { Inter } from 'next/font/google'
import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { useEffect } from 'react';
import { firebase_auth } from "@/firebase/client_side/firebase_init";
import router, { useRouter } from 'next/router';
import { admin_db } from "@/firebase/server_side/firebase_admin_init";
import { db } from "@/firebase/client_side/firebase_init";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { collection, getDocs, doc, query } from "firebase/firestore";
import axios from "axios"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

    const { user } = useContext(UserContext);
    const [userPhones, setUserPhones] = useState([]);

    const userCollection = collection(db, 'Users');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(userCollection);
                const phones: any = [];
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    const phone = userData.phone;
                    phones.push(phone);
                });
                setUserPhones(phones);
            } catch (error) {
                console.error('Error fetching user emails:', error);
                console.error('Error fetching user phones:', error);
            }
        };

        fetchData();
    }, [userCollection]);

    /*
    const findUserIdByPhone = async (searchPhone) => {
        const userCollection = collection(db, 'Users');
        try {
          const querySnapshot = await getDocs(userCollection);
          for (const doc of querySnapshot.docs) {
            const userData = doc.data();
            const phone = userData.phone;
            if (phone === searchPhone) {
              return doc.id;
            }
          }
        } catch (error) {
          console.error('Error fetching user phones:', error);
        }
        return null; // Return null if the phone number is not found
      };
      
      const searchPhone = "9258021344";
      
      findUserIdByPhone(searchPhone)
        .then((userId) => {
          if (userId) {
            console.log("User id:", userId);
          } else {
            console.log("User not found for phone:", searchPhone);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      */

    //const [destination, setDestination] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    //Sample messages for notifications
    const eventReminder = `
    Hello ${user?.firstName || ''},

Get hyped for BASKETBALL. We wanted to remind you that your basketball event is coming up in the next few days:

    Event Details:
    Date: [Event Date]
    Time: [Event Time]
    Location: [Event Location]

Have fun balling! If you want to connect with your group head to the app:)
https://mutuals-beta.vercel.app/myevents

    Your Mutual,
    Devkam
    `;

    const calendarLive = `
    Hello ${user?.firstName || ''},

Our calendar is LIVE. Head over to the app to mark your availability for this weekend!
https://mutuals-beta.vercel.app/calendarpage

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
https://mutuals-beta.vercel.app/myevents

    Your Mutual,
    Devkam
    `;

    //For Event Posted, save response (1 or 2)

    const testAPI = async () => {
        try {
            const response = await axios({
                url: `/api/algo/match`,
                method: "GET",
                data: {"limit": 6}
        })
            console.log(response);
        }
        catch (error) {
            throw error
        }
    }
    const testRespond = async () => {
        try {
            const response = await fetch(`/api/users/B5XzF3Ce3EOa49GKw5dIfTxzh6G2/invitations/test/respond`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify("accept")
        })
            console.log(response);
        }
        catch (error) {
            throw error
        }
    }

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
                <h1 className="text-2xl font-semibold mb-2">Phone Numbers in Database</h1>
                <ul>
                    {userPhones.map((phone, index) => (
                        <li key={index}>{phone}</li>
                    ))}
                </ul>


            </div>

            <div className="flex flex-col items-center justify-center pt-16 gap-1">
                <h1 className="text-2xl font-semibold mb-2">Phone Notification Testing</h1> {/* Header */}
                <form className="flex flex-col mx-auto w-full max-w-screen-md md:w-96"></form>
                <input type="text" placeholder="phone" value={phoneNumber}
                    onChange={(e) => (setPhoneNumber(e.target.value))} className="bg-black border rounded p-2" />
                <br />

                <button onClick={() => sendText(phoneNumber, eventReminder)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded">Send Event Reminder
                    Text
                </button>
                <button onClick={() => testAPI()}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded">
                    tezte
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
