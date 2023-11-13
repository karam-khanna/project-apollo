"use client"
import { useMultiChatLogic, MultiChatSocket, MultiChatWindow } from "react-chat-engine-advanced";
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from "@/context/UserContext"
import { useRouter } from "next/router";
import { User } from '@/interfaces'
import axios from 'axios';
import { custom } from "zod";
import ReportForm from "@/components/chat/reporting";


export default function Chat() {
    const projectId = process.env.NEXT_PUBLIC_CHAT_PROJECT
    const privateId = process.env.NEXT_PUBLIC_CHAT_PRIVATE
    if (!projectId || !privateId) {
        throw new Error("no project id!")
    }
    const router = useRouter();
    const {user, setUser} = useContext(UserContext);
    if (typeof window !== 'undefined') {
        // Now you can safely use the router
        if (!user) {
          router.push('/login').then();
        }
    }
    const chatProps = useMultiChatLogic(projectId, user?.firstName + " " + user?.lastName || '', user?.id || '');
    const [isReady, setReady] = useState(false);
    useEffect(() => {
        setReady(true)
    }, [])

    

    const customRenderChatHeader = (props: { title?: React.ReactNode }) => {
        return <div style={{
            textAlign: 'center',
            fontSize: 'larger',
            fontWeight: 'bold'
        }}>{props.title}</div>;
    };

    const customNoSettings = () => {
        //reporting system goes here
        return <div><ReportForm/></div>
    }
    return isReady ? (
            <div>
                <MultiChatSocket {...chatProps} />
                <MultiChatWindow {...chatProps} renderChatHeader={customRenderChatHeader} renderChatSettings={customNoSettings} style={{height: '100vh'}}/>
            </div>
    ) : <div>errors...</div>
};

