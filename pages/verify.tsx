import {useState} from 'react';
import {ThemeToggle} from "@/components/theme-toggle";
import {firebase_auth} from "@/firebase/client_side/firebase_init";

// Settings component managing user settings
export default function Settings() {
    const [message, setMessage] = useState('');
    const [verificationMethod, setVerificationMethod] = useState('email'); // Default to email verification
    const [verificationCode, setVerificationCode] = useState('');
    const [contactInfo, setContactInfo] = useState('');

    const handleChange = async () => {
        //use a try/catch in case of password change error
        try {
            const user = firebase_auth.currentUser;

            if (!user) {
                setMessage('Please log in first');
                return;
            }

            let verificationTarget;

            if (verificationMethod === 'phone') {
                // If phone verification is selected
                verificationTarget = contactInfo;
                // Send SMS verification code
            } else if (verificationMethod === 'email') {
                // If email verification is selected
                verificationTarget = user.email;
                // Send email verification code
            }

            //enter verification code
            const isVerified = window.prompt('Please enter the verification code sent to your ' + verificationMethod);

            if (isVerified) {
                //take to update password page
            } else {
                setMessage('Verification code is required');
            }
        } catch (error: any) {
            if (error.message) {
                setMessage('Error in verification ' + error.message);
            } else {
                setMessage(`Error in verification. Error message: ${error}`,);
            }

        }
    };
    return (
            <div className="flex flex-col items-center justify-center pt-16 gap-9">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-4">Reset Password</h1>

                    <form className="flex flex-col gap-2 mx-auto w-full md:w-96">
                        <div className="mb-4">
                            <label>Verification Method</label>
                            <select
                                    value={verificationMethod}
                                    onChange={(e) => setVerificationMethod(e.target.value)}
                                    className="bg-black border rounded w-full p-2 text-white"
                            >
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                            </select>
                        </div>
                        {verificationMethod === 'phone' && (
                                <div className="mb-4">
                                    <input
                                            type="text"
                                            placeholder="Phone Number"
                                            value={contactInfo}
                                            onChange={(e) => setContactInfo(e.target.value)}
                                            className="bg-black border rounded w-full p-2 text-white"
                                    />
                                </div>
                        )}
                        {verificationMethod === 'email' && (
                                <div className="mb-4">
                                    <input
                                            type="email"
                                            placeholder="Email"
                                            value={contactInfo}
                                            onChange={(e) => setContactInfo(e.target.value)}
                                            className="bg-black border rounded w-full p-2 text-white"
                                    />
                                </div>
                        )}

                        <button onClick={handleChange}
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