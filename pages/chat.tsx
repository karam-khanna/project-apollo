"use client"
import { useMultiChatLogic, MultiChatSocket, MultiChatWindow } from "react-chat-engine-advanced";
import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/router";
import dotenv from 'dotenv';


export default function Chat() {
  
  const projectId = 'XXXXXXXXXXXXXXXXXX';
  console.log(projectId);
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const chatProps = useMultiChatLogic(projectId, user?.id || '', user?.email || '');
  const [isReady, setReady] = useState(false);
  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <div>
      <MultiChatSocket {...chatProps} />
      <MultiChatWindow  {...chatProps} style={{ height: '100vh' }} />
    </div>
  )
};

