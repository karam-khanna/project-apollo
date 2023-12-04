import {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label"
import {ThemeToggle} from "@/components/theme-toggle";
import {createUserWithEmailAndPassword, sendEmailVerification, signOut} from "firebase/auth";
import {firebase_auth} from "@/firebase/client_side/firebase_init";

//Signup component handling user signup using email and password
export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();  // prevent default form submission behavior

        // Check if the email ends with @emory.edu
        if (!email.endsWith('@emory.edu')) {
            setMessage('Please enter a valid Emory University email address ending with @emory.edu');
            return;
        }
        // Need to connect to database/backend here
        createUserWithEmailAndPassword(firebase_auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log(user);
                    sendEmailVerification(user).then(() => {
                        setMessage('Successfully signed up! Verification email sent.')
                        signOut(firebase_auth)
                    }).catch((error) => {
                        setMessage("Successfully signed up, but the email verification couldn't be sent.")
                        console.log(error)
                    })
                }).catch((error) => {
            console.log(error);
            setMessage(error.code.replace("auth/", "").replace("-", " "))
        })
    }


    return (
            <div className={"flex flex-col items-center justify-center pt-16 gap-4"}>
                <h1 className="text-4xl font-bold">Sign Up for Mutuals!</h1>

                <div className='container mx-auto'/>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-black border rounded p-2 text-white"
                    />
                    <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-black border rounded p-2 text-white"
                    />
                    <Button type="submit">Submit</Button>
                </form>

                {message && <div className="text-2xl mt-4">{message}</div>}

                <p className="mt-4">Already have an account?
                    <span className="text-pink cursor-pointer ml-2" onClick={() => window.location.href = '/login'}>
                    Log In
                </span>
                </p>
            </div>
    )
}