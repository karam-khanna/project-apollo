import {Inter} from 'next/font/google'
import {useContext} from "react";
import {UserContext} from "@/context/UserContext";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const {user, setUser} = useContext(UserContext);
    return (
            <div>
                <div className={"flex flex-col items-center justify-center pt-16 gap-9"}>
                    <h1 className="text-6xl font-bold text-center">Secret Page!</h1>
                    <p>Here we will put admin stuff. Later will add some rules here so only admins can visit this page
                        and take it off the header</p>
                    <div className={"flex flex-col items-center"}>
                        <h1 className="text-6xl font-bold text-center">User Info</h1>
                        <p>First Name: {user?.firstName}</p>
                        <p>Last Name: {user?.lastName}</p>
                    </div>
                </div>
            </div>

    )
}
