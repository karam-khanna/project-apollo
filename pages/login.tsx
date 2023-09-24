import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {Label} from "@/components/ui/label"
import {ThemeToggle} from "@/components/theme-toggle";
import { auth } from "../components/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            console.log(userCredential.user);
            setMessage('Successfully logged in!');
        }).catch((error) => {
            console.log(error);
            setMessage('There was an error checking you in. Please check your email and password and try again.')
        })
    }

    return (
        <div className={"flex flex-col items-center justify-center pt-16 gap-9"}>
            <h1 className="text-4xl font-bold">Log in to Mutuals!</h1>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="border rounded p-2"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="border rounded p-2"
                />
                <Button type="submit">Submit</Button>
            </form>

            {message && <div className="text-2xl mt-4">{message}</div>}

            <p className="mt-4">Don't have an account? 
                <span className="text-pink-500 cursor-pointer ml-2" onClick={() => window.location.href = '/signup'}>
                    Sign Up
                </span>
            </p>
            <div className={"flex items-center"}>
                    <Label className={"text-xl"}>Light/Dark Toggle</Label>
                    <ThemeToggle/>
            </div>
        </div>
    )
}
