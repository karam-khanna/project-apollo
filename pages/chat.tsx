"use client"
import { useMultiChatLogic, MultiChatSocket, MultiChatWindow } from "react-chat-engine-advanced";
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from "@/context/UserContext"
import { useRouter } from "next/router";
import { User } from '@/interfaces'
import axios from 'axios';
import { custom } from "zod";

// React component for the chat function
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

    // Redirect to login page if user is not logged in
    if (typeof window !== 'undefined') {
        // Now you can safely use the router
        if (!user) {
          router.push('/login').then();
        }
    }

    // Initialize chat logic
    const chatProps = useMultiChatLogic(projectId, user?.email || '', user?.id || '');

    // State to track whether chat is ready
    const [isReady, setReady] = useState(false);
    useEffect(() => {
        setReady(true)
    }, [])

    
    // Cusotm rendering for chat 
    const customRenderChatHeader = (props: { title?: React.ReactNode }) => {
        return <div style={{
            textAlign: 'center',
            fontSize: 'larger',
            fontWeight: 'bold'
        }}>{props.title}</div>;
    };
    const customNoSettings = () => {
        //reporting system goes here
        return <div></div>
    }
    
    return isReady ? (
            <div>
                <MultiChatSocket {...chatProps} />
                <MultiChatWindow {...chatProps} renderChatHeader={customRenderChatHeader} renderChatSettings={customNoSettings} style={{height: '100vh'}}/>
            </div>
    ) : <div>errors...</div>
};

