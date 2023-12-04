import * as React from "react";
import { Share } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface ShareBoxProps {
    onClose: () => void;
  }
  
const ShareBox: React.FC<ShareBoxProps> = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const inviteMutuals = `
    You've been invited to Mutuals!

Mutuals is a website that allows its members to connect and plan poker and basketball events with other Emory students.

To find out more, head to the official website:
https://mutuals-beta.vercel.app

Your Mutual,
Devkam
    `;

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

  const handleSend = () => {
    // Handle logic for sending the phone number
    console.log("Sending phone number:", phoneNumber);
    sendText(phoneNumber, inviteMutuals)
    // Close the pop-up
    onClose();
  };

  return (
    <div className="fixed top-16 right-0 transform -translate-x bg-black border p-4 shadow-md rounded">
      <button className="close-button absolute top-2 right-2 text-white" onClick={onClose}>
        Close
      </button>
      <label className="block mb-4 text-white">
        Share Mutuals with a Friend!
        <input
          type="text"
          placeholder="Friend's Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border p-2 w-full text-white rounded mt-2"
          style={{ backgroundColor: 'grey' }}
        />
      </label>
      <Button onClick={handleSend}>
        Send
      </Button>
    </div>
  );
};

export function ShareSite() {
  const [isPopUpVisible, setPopUpVisibility] = React.useState(false);

  const openPopUp = () => {
    setPopUpVisibility(true);
  };

  const closePopUp = () => {
    setPopUpVisibility(false);
  };

  return (
    <div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={openPopUp}>
          <Share className="hidden h-5 w-5 dark:block "/>
          <Share className="h-[1.5rem] w-[1.3rem] dark:hidden"/>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {isPopUpVisible && <ShareBox onClose={closePopUp} />}
    </div>
  );
}
