import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export default function ChatPage() {
    const { user, chats } = useContext(UserContext);

    return (
        <div>
            <h1 className="text-6xl font-bold text-center">Chats</h1>
            <div>
                {chats.map((chatId, index) => (
                    <div key={index}>
                        Chat ID: {chatId}
                    </div>
                ))}
            </div>
        </div>
    );
}