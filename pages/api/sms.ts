import { NextApiRequest, NextApiResponse } from "next";
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method == 'POST'){
        const twilioMessage = await req.body.Body;
        const senderPhoneNumber = await req.body.From;

        const responseMessage = "Message received: " + twilioMessage;
        
        const twilioResponse = `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Message>${responseMessage}</Message>
      </Response>
    `;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).end(twilioResponse)
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