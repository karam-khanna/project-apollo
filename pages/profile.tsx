import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import {useRouter} from 'next/router';

interface ProfileData {
    name: string;
    email: string;
    interests: string[];
    age: string; // Add age property
    picture: string; // Add picture property
}

const ProfilePage: React.FC = () => {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();
    // Ensure that user exists before accessing its properties
    const [profile, setProfile] = useState<ProfileData>({
        name: user ? `${user.firstName} ${user.lastName}` : '',
        email: user ? user.email : '',
        interests: ['Poker', 'Basketball'],
        age: user ? user.age : '', // Get the age property from the user
        picture: user ? user.picture : '', // Get the picture URL from the user
    });

    return (
        <div className="flex flex-col items-center justify-center pt-16 gap-10">
            <div className="container mx-auto px-4 pt-16">
                <div className="bg-gray-800 rounded-lg p-8">
                    <h1 className="text-6xl font-bold text-center"> Mutuals.</h1>

                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className='mb-5'></div>
                        <div className="flex items-center">
                            <Avatar>
                            <div style={{ width: '100px', height: '100px' }}>
                                    <AvatarImage src={profile.picture} /> {/* Use the picture URL from the profile */}
                            </div>
                                <AvatarFallback>PIC</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className='mb-4'></div>

                        <div className='text text-gray-300'>Interests:</div>
                        <div className="flex gap-2 mb-4">
                            {profile.interests.map((interest, index) => (
                                <Badge key={index}>{interest}</Badge>
                            ))}
                        </div>

                        <div className="bg-black p-2 text-white rounded-xl w-64 h-16 text-center">
                            <div className="text-xs text-pink">Name:</div>
                            {profile.name}
                        </div>
                        <div className="bg-black p-2 text-white rounded-xl w-64 h-16 text-center">
                            <div className="text-xs text-pink">Email:</div>
                            {profile.email}
                        </div>

                        {/* Add a section to display age */}
                        <div className="bg-black p-2 text-white rounded-xl w-64 h-16 text-center">
                            <div className="text-xs text-pink">Age:</div>
                            {profile.age}
                        </div>

                        <Button onClick={() => router.push('/updateprofile').then()}>Edit Profile</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
