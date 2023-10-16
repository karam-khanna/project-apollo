import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { firebase_auth } from "@/components/firebase";

interface ProfileData {
  name: string;
  email: string;
  interests: string[];
}

const ProfilePage: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  // Ensure that user exists before accessing its properties
  const [profile, setProfile] = useState<ProfileData>({
    name: user ? `${user.firstName} ${user.lastName}` : '', // Check for user and concatenate names
    email: user ? user.email : '', // Check for user and get email
    interests: ['Poker', 'Basketball'],
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
                  <AvatarImage src="https://github.com/shadcn.png" />
                </div>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <Button style={{ fontSize: '10px', width: '100px', height: '25px' }}>Edit Picture</Button>
            <div className='mb-4'></div>

            <div className='text text-gray-300'>Interests:</div>
            {/* Display the interests as badges side by side */}
            <div className="flex gap-2 mb-4">
              {profile.interests.map((interest, index) => (
                <Badge key={index}>{interest}</Badge>
              ))}
            </div>

            {/* Separate divs for each piece of data with labels and a black background, equal dimensions, and center-aligned text */}
            <div className="bg-black p-2 text-white rounded-xl w-64 h-16 text-center">
              <div className="text-xs text-pink">Name:</div>
              {profile.name}
            </div>
            <div className="bg-black p-2 text-white rounded-xl w-64 h-16 text-center">
              <div className="text-xs text-pink">Email:</div>
              {profile.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
