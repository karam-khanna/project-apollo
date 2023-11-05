import React, { useContext, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserContext } from "@/context/UserContext";
import { Label } from '@radix-ui/react-label';
import { useRouter } from 'next/router';

const InvitePageContent: React.FC = () => {
  const { user } = useContext(UserContext);

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

const InvitePage: React.FC = () => {
  const router = useRouter();

  // You can use `useRouter` within a `useEffect` hook if needed
  useEffect(() => {
    // Access router here if necessary
  }, []);

  return (
    <InvitePageContent />
  );
};

export default InvitePage;
