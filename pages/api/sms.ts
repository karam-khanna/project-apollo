import { NextApiRequest, NextApiResponse } from "next";
import twilio from 'twilio';
import {Inter} from 'next/font/google'
import {useContext, useState} from "react";
import {UserContext} from "@/context/UserContext";
import {useEffect} from 'react';
import {firebase_auth} from "@/firebase/client_side/firebase_init";
import { useRouter } from 'next/router';
import {admin_db} from "@/firebase/server_side/firebase_admin_init";
import {db} from "@/firebase/client_side/firebase_init";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { collection, getDocs, doc, query} from "firebase/firestore";


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//function to search all phone numbers in firestore and return the matching userId
const findUserIdByPhone = async (searchPhone: any) => {
    const userCollection = collection(db, 'Users');
    try {
          const querySnapshot = await getDocs(userCollection);
          for (const doc of querySnapshot.docs) {
            const userData = doc.data();
            const phone = userData.phone;
            if (phone === searchPhone) { // phone numbers match
              return doc.id; //docId is the uId in collection
            }
          }
        } catch (error) {
          console.error('Error fetching user phones:', error);
        }
        return null; // Return null if the phone number is not found
};

const sms = async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method == 'POST'){
        const twilioMessage = await req.body.Body;
        const senderPhoneNumber = await req.body.From;

        const responseMessage = "Our demo to receiving the text: " + twilioMessage + ", " + senderPhoneNumber;
        
        await sendText (senderPhoneNumber, responseMessage);

        res.setHeader('Content-Type', 'application/xml');
        res.status(200).end('')
    }
}

const sendText = async (to: string, message: string) => {
    try {
        await client.messages.create({
            body: message,
            to, // The recipient's phone number
            from: '+18559620462', // Your Twilio phone number
          })
         

    } catch (error){
        console.log('Error sending text:', error);
      
    }
};

export default sms;