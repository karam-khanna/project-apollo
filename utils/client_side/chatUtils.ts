import axios from 'axios'
import { getUserFromDb } from '../server_side/serverDbInterface';
import { User } from '@/interfaces';

export function makeChatUser(userid: string) {
    axios({
        method: 'post',
        url: '/api/chat/update',
        data: {
            userid: userid
        }
    }).then((response) => {return response.data})
    .catch((error) => { throw new Error(error) });
}

export async function getMyChats(user: User){
        axios({
            method: 'get',
            url: 'https://api.chatengine.io/chats/',
            headers: {
                'project-id': process.env.NEXT_PUBLIC_CHAT_PROJECT as string,
                'user-name': user?.firstName + " " + user?.lastName,
                'user-secret': user?.id
            }
        })
        .then((response) => {return response})
        .catch((error) => {throw new Error(error)});
}

