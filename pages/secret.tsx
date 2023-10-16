import {Inter} from 'next/font/google'
import {useContext, useState} from "react";
import {UserContext} from "@/context/UserContext";
import { useEffect } from 'react';
const inter = Inter({subsets: ['latin']})

export default function Home() {
    const {user, setUser} = useContext(UserContext);
    const [destination, setDestination] = useState("")
    const [message, setMessage] = useState("")
    const [subject, setSubject] = useState("")
    

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


                <input type="text" placeholder = "email" value={destination} onChange={(e)=>(setDestination(e.target.value))}/>
                <br/>
                <input type="text" placeholder = "subject" value={subject} onChange={(e)=>(setSubject(e.target.value))}/>
                <br/>
                <input type="text" placeholder = "text" value={message} onChange={(e)=>(setMessage(e.target.value))}/>
                <br/>

                <button onClick={()=>sendEmail(destination, message, subject)}>Send Email</button>


            </div>

    )
}
