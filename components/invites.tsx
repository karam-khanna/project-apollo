import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import useSWR from "swr";
import { Invitation } from "@/interfaces";
import { fetcherWithNoAuthToken } from "@/utils/client_side/helpers";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { EventsContext } from "@/context/EventsContext";

function format(name: string) {
    // Split the name before the first uppercase letter
    const words = name.split(/(?=[A-Z])/);
  
    // Capitalize the first letter of each word and join them with spaces
    const formattedName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
    return formattedName;
  }

export default function InvitationsPane(){
    const { user } = useContext(UserContext);
    const { events, setEvents } = useContext(EventsContext);
    const { data: invites, error } = useSWR<Invitation[]>(
            user ? `/api/users/${user.id}/invitations` : null,
            fetcherWithNoAuthToken,
        );
    const [invitations, setInvitations] = useState<Invitation[]>()
    useEffect(() => {
        if(invites){
            setEvents(invites.filter(item => item.status == "accept"))
            console.log(events)
            setInvitations(invites.filter(item => item.status == "notSent"))
        }
    }, [invites])
    
    
    if (!invitations || invitations.length == 0) {
        return (
            <div className="flex gap-4 overflow-x-auto" style={{ paddingTop: '60px' }}>
            < Card >
                <CardHeader>
                    <CardTitle>No current invites. 😢</CardTitle>
                    <CardDescription>You&apos;ve either submitted all potential invites or have not been invited to anything. Check back soon!</CardDescription>
                </CardHeader>
            </Card >
            </div>
        )
    }
    const respond = (invite: Invitation, status: string) => {
        fetch(`/api/users/${user?.id}/invitations/${invite.id}/respond`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(status),
        }).then(r => console.log("response submitted"))
        setInvitations(invitations.filter(item => item !== invite))
        if(status == "accept"){
            setEvents(events? events.concat([invite]) : [invite])
        }
    }
    return (
        <div className="flex max-w-[200px] sm:max-w-[500px] overflow-x-auto gap-4">
        {invitations.map((invite) => (
            < Card key={invite.timeslot + " " + invite.interest} className="w-[225px] flex-shrink-0" >
                <CardHeader>
                    <CardTitle>{String(invite.interest).charAt(0).toUpperCase() + String(invite.interest).substring(1,)}</CardTitle>
                    <CardDescription>{format(invite.timeslot)}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                    <Button onClick={() => respond(invite, 'accept')}>Accept</Button>
                    <Button variant="outline" onClick={() => respond(invite, 'decline')}>Decline</Button>
                </CardFooter>
            </Card >
        ))}
        </div>
    )


}