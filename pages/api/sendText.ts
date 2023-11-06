import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendText = async (req:any, res:any) => {

    const {to, message} = JSON.parse(req.body);

    try {
        await client.messages.create({
            body: message,
            to, // The recipient's phone number
            from: '+18559620462', // Your Twilio phone number
          })
          res.status(200).json({message: 'Text sent'});

    } catch (error){
        console.log('Error sending text:', error);
        res.status(500).json({error: 'Text not sent'});
    }

}

export default sendText;