import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {Label} from "@/components/ui/label"
import {ThemeToggle} from "@/components/theme-toggle";

export default function Signup() {
    const [fname, setFirstName] = useState('');
    const [lname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();  // prevent default form submission behavior

        // Need to connect to database/backend here

        setMessage('Successfully signed up!');
    }

    return (
        <div className={"flex flex-col items-center justify-center pt-16 gap-9"}>
            <h1 className="text-4xl font-bold">Sign Up for Mutuals!</h1>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input 
                    type="fname" 
                    placeholder="First Name" 
                    value={fname} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    className="border rounded p-2"
                />
                <input 
                    type="lname" 
                    placeholder="Last Name" 
                    value={lname} 
                    onChange={(e) => setLastName(e.target.value)} 
                    className="border rounded p-2"
                />
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

            <p className="mt-4">Already have an account? 
                <span className="text-pink-500 cursor-pointer ml-2" onClick={() => window.location.href = '/login'}>
                    Log In
                </span>
            </p>
            <div className={"flex items-center"}>
                    <Label className={"text-xl"}>Light/Dark Toggle</Label>
                    <ThemeToggle/>
            </div>
        </div>
    )
}