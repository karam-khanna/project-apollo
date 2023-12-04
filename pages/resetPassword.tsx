import {useState} from 'react';
import {ThemeToggle} from "@/components/theme-toggle";
import {firebase_auth} from "@/firebase/client_side/firebase_init";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

// Settings component managing user settings
export default function Settings() {
    const [message, setMessage] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const auth = getAuth();

    const triggerResetEmail = async () => {
        sendPasswordResetEmail(auth, emailAddress).then(()=>{
            setMessage("Done!")
        }).catch((error)=>{
            setMessage(error.code.replace("auth/", "").replace("-", " "))
        })
    }

    return (
            <div className="flex flex-col items-center justify-center pt-16 gap-9">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-4">Reset Password</h1>

                    <form className="flex flex-col gap-2 mx-auto w-full md:w-96">

                        
                        <div className="mb-4">
                            <input
                                            type="email"
                                            placeholder="Email"
                                            value={emailAddress}
                                            onChange={(e) => setEmailAddress(e.target.value)}
                                            className="bg-black border rounded w-full p-2 text-white"
                            />
                        </div>
                        

                        <button onClick={triggerResetEmail} 
                                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded w-full"
                        >
                            Reset Password
                        </button>
                    </form>

                    {/* Message Styling */}
                    {message && <div className="text-lg text-center mt-4 text-white">{message}</div>}
                </div>
            </div>
    );

}