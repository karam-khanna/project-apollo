import axios from 'axios'

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

