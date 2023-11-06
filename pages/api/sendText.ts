import { NextApiRequest, NextApiResponse } from "next";
import twilio from 'twilio';


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);




const baseUrl = process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'


export default async (req: NextApiRequest, res: NextApiResponse) => {
if(req.method == 'POST'){
const twilioMessage = await req.body.Body;
const senderPhoneNumber = await req.body.From;


const responseMessage = "Message received: " + twilioMessage;
sendText (senderPhoneNumber, responseMessage);


const twilioResponse = `
<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${responseMessage}</Message>
/Response>
`;


res.setHeader('Content-Type', 'application/xml');
res.status(200).end(twilioResponse)
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
