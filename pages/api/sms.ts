import { NextApiRequest, NextApiResponse } from "next";
import twilio from 'twilio';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/client_side/firebase_init";


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
        findUserIdByPhone(senderPhoneNumber)
            .then((userId) => {
                let responseMessage = "User not found for phone: " + senderPhoneNumber;
                if (userId) {
                console.log("User id:", userId);
                responseMessage = "Our demo to receiving the text: " + twilioMessage + ", User ID: " + userId;
                }
                // Send the response message
                sendText(senderPhoneNumber, responseMessage)
                .then(() => {
                    console.log("Response message sent successfully.");
                })
                .catch((error) => {
                    console.error('Error sending response message:', error);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).end('');
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