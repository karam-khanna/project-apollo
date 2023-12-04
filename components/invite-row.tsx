import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Invitation} from "@/interfaces";
import {formatRelative} from 'date-fns';
import {useContext, useState} from "react";
import {UserContext} from "@/context/UserContext";
import {mutate} from "swr";

type InviteRowProps = {
    invite: Invitation
}

export function InviteRow({invite}: InviteRowProps) {
    let timeslot = invite.timeslot.split(/(?=[A-Z])/)
    let day = timeslot[0]
    let time = timeslot[1]

    // capitalize the first letter of each word and join them with spaces
    const formattedDay = day.charAt(0).toUpperCase() + day.slice(1)
    const formattedTime = time.charAt(0).toUpperCase() + time.slice(1)
    const dateString = formattedDay + " " + formattedTime
    const {user} = useContext(UserContext);

    return (
            <div className="space-y-6 pb-4">
                <div className="flex items-center space-x-4">
                    <Badge className="h-6 w-6 bg-yellow-500"/>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground capitalize">{invite.interest}</p>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground truncate">{dateString}</p>

                    </div>
                    <div>
                        <Button size="sm" onClick={async () => {
                            fetch(`/api/users/${user?.id}/invitations/${invite.id}/respond`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify("accept"),
                            }).then(r => console.log("response submitted"))
                            await mutate(`/api/users/${user?.id}/invitations`);
                        }}>
                            Accept
                        </Button>
                    </div>
                </div>
            </div>
    )
}