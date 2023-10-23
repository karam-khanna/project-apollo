"use client"
import { useMultiChatLogic, MultiChatSocket, MultiChatWindow } from "react-chat-engine-advanced";
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/router";


export default function Chat() {

  const projectId = 'XXXXXXXXXXXXXXXXXXX';
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const chatProps = useMultiChatLogic(projectId, user?.id || '', user?.email || '');
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
  return isReady ? (
    <div>
      <MultiChatSocket {...chatProps} />
      <MultiChatWindow {...chatProps} renderChatHeader={customRenderChatHeader} style={{ height: '100vh' }} />
    </div>
  ) : <div>errors...</div>
};

