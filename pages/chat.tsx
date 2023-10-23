"use client"
import { useMultiChatLogic, MultiChatSocket, MultiChatWindow } from "react-chat-engine-advanced";
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/router";
import axios from 'axios';


export default function Chat() {
  const projectId = process.env.CHAT_PROJECT

  if (!projectId) {
    throw new Error("no project id!")
  }
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const chatProps = useMultiChatLogic(projectId, user?.id || '', user?.email || '');
  const [isReady, setReady] = useState(false);
  useEffect(() => {
    setReady(true)
  }, [])
  axios.put(
    'https://api.chatengine.io/users/',
    {
      'username': user?.id,
      'secret': user?.email
    },
    {
      headers: {
        'PRIVATE-KEY': process.env.CHAT_PRIVATE
      }
    }
  ).then((response) => {
    console.log(response.data)
  }
  ).catch(() => console.log("error")
  );
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

