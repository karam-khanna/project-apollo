import React, { useContext } from 'react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserContext } from "@/context/UserContext";
import { useRouter } from 'next/router';
import { Label } from '@radix-ui/react-label';

const invitePage: React.FC = () => {
    const { user } = useContext(UserContext);
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center pt-16 gap-9">
            <h1 className="text-6xl font-bold text-center">You are Invited!</h1>

            <div className="flex items-center">
                <Label className="text-xl">Light/Dark Toggle</Label>
                <ThemeToggle />
            </div>
        </div>
    );
};

export default invitePage;
