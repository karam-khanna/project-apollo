"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm, SubmitHandler} from "react-hook-form";
import * as z from "zod";
import {useRouter} from 'next/router';
import {useContext, useEffect} from 'react';

import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {toast} from "@/components/ui/use-toast";
import useSWR from "swr";
import {Invitation} from "@/interfaces";
import {UserContext} from "@/context/UserContext";
import {fetcherWithNoAuthToken} from "@/utils/client_side/helpers";

// Define a schema for a single event response
const EventResponseSchema = z.object({
    type: z.enum(["accept", "decline"]),
});

// Create a dynamic schema based on the events
const createFormSchema = (invitations: Invitation[]) => {
    const eventSchemas: Record<string, any> = {};
    invitations.forEach((invite) => {
        eventSchemas[invite.id] = EventResponseSchema;
    });
    return z.object({
        events: z.record(z.string(), EventResponseSchema).refine(data =>
                        invitations.every(event => Object.keys(data).includes(event.id)),
                {message: "All events must have a response."}),
    });
};

function format(name: string) {
    // Split the name before the first uppercase letter
    const words = name.split(/(?=[A-Z])/);
  
    // Capitalize the first letter of each word and join them with spaces
    const formattedName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
    return formattedName;
  }

  //Using and exporting shadcn component
export default function RadioGroupForm() {
    const {user} = useContext(UserContext);
    const {data: invitations, error} = useSWR<Invitation[]>(
            user ? `/api/users/${user.id}/invitations` : null,
            fetcherWithNoAuthToken,
    );
    const router = useRouter();


    // useEffect(() => {
    //     // Pre-fill the form with the events
    //     invitations.forEach(invite => {
    //         form.setValue(`events.${invite.id}`, {type: "decline"});
    //     });
    // }, [form]);

    console.log(invitations, "invitations")
    const FormSchema = createFormSchema(invitations || []);
    type FormData = z.infer<typeof FormSchema>;
    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
    });
    if (!invitations) {
        return (<div>Loading...</div>)
    }

    // The form schema based on the events


    const onSubmit: SubmitHandler<FormData> = (data) => {
        toast({
            title: "You submitted the following values:",
            description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
            ),
        });

        // for each event, send the response to the server to accept or decline
        invitations.forEach(invite => {
            const eventResponse = data.events[invite.id];
            if (!eventResponse) {
                return;
            }
            fetch(`/api/users/${user?.id}/invitations/${invite.id}/respond`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventResponse.type),
            }).then(r => console.log("response submitted"))
        })
        router.push('/myevents');
    };


    return (
            <div className="flex flex-col items-center justify-center pt-16 gap-9">
                <h1 className="text-6xl font-bold text-center"> Invitations </h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="items-center space-y-8">
                        {invitations.map((invite) => (
                                <FormField
                                        key={invite.id}
                                        control={form.control}
                                        name={`events.${invite.id}.type`}
                                        render={({field}) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel
                                                            className="text-pink cursor-pointer ml-2 font-bold ">{String(invite.interest).charAt(0).toUpperCase() + String(invite.interest).substring(1,) + ": " + format(invite.timeslot)}</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                                onValueChange={field.onChange}
                                                                value={field.value}
                                                                className="flex flex-col space-y-1"
                                                        >
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="accept"/>
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    Accept
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="decline"/>
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    Decline
                                                                </FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                        )}
                                />
                        ))}
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
    );
}

