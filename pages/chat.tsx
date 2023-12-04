"use client"
import { useMultiChatLogic, MultiChatSocket, MultiChatWindow } from "react-chat-engine-advanced";
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from "@/context/UserContext"
import { useRouter } from "next/router";
import { User } from '@/interfaces'
import axios from 'axios';
import { custom } from "zod";
import ReportForm from "@/components/chat/reporting";
import { useTheme } from "next-themes";

export default function Chat() {
    const projectId = process.env.NEXT_PUBLIC_CHAT_PROJECT
    const privateId = process.env.NEXT_PUBLIC_CHAT_PRIVATE
    if (!projectId || !privateId) {
        throw new Error("no project id!")
    }

    // Initialize Next.js router
    const router = useRouter();
    
    // Access user information from context.
    const {user, setUser} = useContext(UserContext);

    const {theme, setTheme} = useTheme()

    if (typeof window !== 'undefined') {
        // Now you can safely use the router
        if (!user) {
          router.push('/login').then();
        }
    }
    const [isReady, setReady] = useState(false);
    useEffect(() => {
        setTheme("light")
        setReady(true)

    const customNoSettings = () => {
        //reporting system goes here
        return <div><ReportForm/></div>
    }

            <div>
                <MultiChatSocket {...chatProps} />
                <MultiChatWindow {...chatProps} renderChatSettings={customNoSettings} style={{height: '90vh'}}/>
            </div>
    ) : <div>errors...</div>
    }
    else {
        return isReady ? (
            <div>
                <MultiChatSocket {...chatProps} />
                <MultiChatWindow {...chatProps} renderWelcomeGif = {noWelcomeGif} renderChatSettings={customNoSettings} style={{height: '80vh'}}/>
            </div>
    ) : <div>errors...</div>
    }
    
};

