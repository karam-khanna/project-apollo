import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/router";
import { firebase_auth } from "@/firebase/client_side/firebase_init";
import axios from "axios";


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        signInWithEmailAndPassword(firebase_auth, email, password)
            .then((userCredential) => {
                console.log(userCredential.user);
                if (!process.env.NEXT_PUBLIC_CHAT_PRIVATE){
                    throw new Error('No private key!')
                }
                if (userCredential.user.emailVerified) {
                    axios.put(
                        'https://api.chatengine.io/users/',
                        {
                            'username': userCredential.user.uid,
                            'secret': userCredential.user.email
                        },
                        {
                            headers: {
                                'PRIVATE-KEY': process.env.NEXT_PUBLIC_CHAT_PRIVATE
                            }
                        }
                    ).then((response) => {
                        console.log(response.data)
                    }
                    ).catch(() => console.log("error")
                    );
                    setMessage('Successfully logged in!');
                    router.push('/').then();
                } else {
                    sendEmailVerification(userCredential.user).then(() => {
                        setMessage('You need to verify your email to login. Please check your email to verify.')
                    }).catch((error) => {
                        setMessage("Your email isn't verified, and there seems to be an error with the verification process.")
                        console.log(error)
                    })
                }
            })
            .catch((error) => {
                console.log(error);
                setMessage('There was an error checking you in. Please check your email and password and try again.');
            });
    };

    return (
        <div className="flex flex-col items-center justify-center pt-16 gap-9">
            {/* Responsive Container with Horizontal Padding */}
            <div className="container mx-auto px-4 pt-16">
                <h1 className="text-4xl font-bold text-center">Log in to Mutuals!</h1>

                <div className='mt-4' />

                {/* Center the form on large screens */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:w-1/2 lg:w-1/2 mx-auto">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-black border rounded p-2"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-black border rounded p-2"
                    />
                    <Button type="submit">
                        Submit
                    </Button>
                </form>

                {/* Message Styling */}
                {message && <div className="text-lg text-center mt-4">{message}</div>}

                <p className="mt-4 text-center">
                    {"Don't have an account?"}
                    {/* Sign Up Link Styling */}
                    <span
                        className="text-pink cursor-pointer ml-2"
                        onClick={() => window.location.href = '/signup'}
                    >
                        Sign Up
                    </span>
                </p>

                <p className="mt-4 text-center">
                    Forgot Your Password?
                    {/* Sign Up Link Styling */}
                    <span
                        className="text-pink cursor-pointer ml-2"
                        onClick={() => window.location.href = '/verify'}
                    >
                        Reset Password
                    </span>
                </p>

                {/* Light/Dark Toggle */}
                <div className="flex items-center justify-center mt-6">
                    <Label className="text-xl">Light/Dark Toggle</Label>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
}
