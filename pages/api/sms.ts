import { NextApiRequest, NextApiResponse } from "next";
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method == 'POST'){
        const twilioMessage = req.body.Body;
        const senderPhoneNumber = req.body.From;

        sendText (senderPhoneNumber, "message received that: "+twilioMessage);

    }
}

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