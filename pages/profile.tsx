import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from 'next/router';

interface ProfileData {
  name: string;
  email: string;
  interests: string[];
  age: string; // Add age property
  picture: string; // Add picture property
}

//ProfilePage component displaying user interests
export default function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter(); 
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Set timeout to display content after a delay for the transition effect
    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 500); // Adjust timing as needed

    return () => clearTimeout(timeout); // Clear timeout on unmount for cleanup
  }, []);

  let ints: string[] = []
  if(user){
    if(user.basketball){
      ints.push("Basketball")
    }
    if(user.poker){
      ints.push("Poker")
    }
  }

  const slideInStyles: React.CSSProperties = {
    transform: `translateX(${showContent ? '0' : '-100vw'})`,
    transition: 'transform 0.5s ease-in-out',
    width: '100%',
  };


  return (
    <div className="flex flex-col items-center justify-center pt-16 gap-10">

      <div className="container mx-auto px-4 pt-16 w-2/3  mb-10">
        <div className="rounded-lg p-8" style={{ backgroundColor: 'rgba(218, 150, 148, 0.5)', ...slideInStyles }}>
          <h1 className="text-6xl font-bold text-center text-white"> Mutuals.</h1>

          <div className={"flex flex-col items-center justify-center gap-2"} style={slideInStyles}>
            <div className='mb-5'></div>
            <div className="flex items-center">
              <Avatar>
                <div style={{ width: '150px', height: '150px' }}>
                  <AvatarImage src={user?.picture} /> {/* Use the picture URL from the profile */}
                </div>
                <AvatarFallback>PIC</AvatarFallback>
              </Avatar>
            </div>

            <div className='mb-4'></div>

            <div className='text text-white'>Interests:</div>
            <div className="flex gap-2 mb-4">
              {ints.map((interest, index) => (
                <Badge key={index}>{interest}</Badge>
              ))}
            </div>

            <div className="bg-black p-2 text-white rounded-xl w-64 h-16 text-center">
              <div className="text-xs text-pink">Name:</div>
              {user?.firstName + " " + user?.lastName}
            </div>
            <div className="bg-black p-2 text-white rounded-xl w-64 h-16 text-center">
              <div className="text-xs text-pink">Email:</div>
              {user?.email}
            </div>

            {/* Add a section to display age */}
            <div className="bg-black p-2 text-white rounded-xl w-64 h-16 text-center">
              <div className="text-xs text-pink">Age:</div>
              {user?.age}
            </div>

            <Button onClick={() => router.push('/updateprofile')}>Edit Profile</Button>
          </div>
        </div>
      </div>
    </div>
  )
};