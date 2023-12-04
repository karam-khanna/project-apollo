"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"

import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {toast} from "@/components/ui/use-toast"
import {parseAvailability} from "@/utils/client_side/helpers";
import {useContext, useEffect} from "react";
import { useRouter } from "next/router"
import {UserContext} from "@/context/UserContext";
import { Interest } from "@/interfaces"


const items = [
    {
        id: "fridayMorning",
        label: "Morning",
    },
    {
        id: "fridayAfternoon",
        label: "Afternoon",
    },
    {
        id: "fridayEvening",
        label: "Evening",
    },
    {
        id: "fridayLateNight",
        label: "Late Night",
    },
    {
        id: "saturdayMorning",
        label: "Morning",
    },
    {
        id: "saturdayAfternoon",
        label: "Afternoon",
    },
    {
        id: "saturdayEvening",
        label: "Evening",
    },
    {
        id: "saturdayLateNight",
        label: "Late Night",
    },
    {
        id: "sundayMorning",
        label: "Morning",
    },
    {
        id: "sundayAfternoon",
        label: "Afternoon",
    },
    {
        id: "sundayEvening",
        label: "Evening",
    },
    {
        id: "sundayLateNight",
        label: "Late Night",
    },
] as const

const FormSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
})



export default function CheckboxReactHookFormMultiple() {

    const {user} = useContext(UserContext);
    const router = useRouter()
    console.log(user)
    useEffect(() => {
        if(user && user?.firstName == "") {
            console.log("User onboarding not updated")
            router.reload()
        }
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: []
        },
    })

    //Storing user chosen slots to databse
    async function onSubmit(data: z.infer<typeof FormSchema>) {

        if (user) {
            let availability = parseAvailability(user, data.items) // Parse user's availability based on selected items.
            if (availability) {// Update user's availability 
                const res = await fetch(`/api/users/${user.id}/availability/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(availability),
                })
                console.log("res", await res.json())
            }

            // Log availability and display a toast notification
            console.log("availability", availability)
            const results: any = []
            const uid: string = availability.userId
            const weekStart: string = availability.weekStart
            const interests: string[] = availability.interests
            for(const key in availability){
                if(!['userId', 'id', 'weekStart', 'interests'].includes(key)){
                    if((availability as any)[key]){
                        for(const i in interests){
                            results.push({
                                "timeslot": key,
                                "interest": interests[i],
                                "id": uid,
                                "date": String(new Date())
                            })
                        }
                    }
                }
            }
            const response = await fetch(`/api/algo/increment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(results),
            })
            router.push("/")
        } else {
            toast({
                title: "Not logged in!",
            })
        }

    }

    // Rendering form
    return (
        <div className="flex flex-col items-center justify-center pt-16 gap-9">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="items-center space-y-8">
                        <FormField
                                control={form.control}
                                name="items"
                                render={() => (
                                        <FormItem>
                                            <FormLabel
                                                    className="text-2xl sm:text-5xl font-semibold pt-7 sm:pt-16">For
                                                this weekend...</FormLabel>
                                            <FormDescription className="">
                                                {"Select the times this weekend that you're available."}
                                            </FormDescription>
                                            <div>
                                                <ul className="list-disc p1-4">
                                                    <li>Morning: 8 AM - 12 PM</li>
                                                    <li>Afternoon: 12 PM - 5 PM</li>
                                                    <li>Evening: 5 PM - 8 PM</li>
                                                    <li>Night: 8 PM - 12 AM</li>
                                                </ul>
                                            </div>

                                            <div className="flex flex-row items-center space-x-10 space-y-0">
                                                {/* First set of items */}
                                                <div className="flex flex-col items-left space-y-3">
                                                    <div className="bg-pink p-2 rounded-md">
                                                        <h1 className='text-white font-bold'>FRIDAY</h1>
                                                    </div>
                                                    {items.slice(0, 4).map((item) => (
                                                            <FormField
                                                                    key={item.id}
                                                                    control={form.control}
                                                                    name="items"
                                                                    render={({field}) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                            checked={field.value?.includes(item.id)}
                                                                                            onCheckedChange={(checked) => {
                                                                                                return checked
                                                                                                        ? field.onChange([...field.value, item.id])
                                                                                                        : field.onChange(
                                                                                                                field.value?.filter(
                                                                                                                        (value) => value !== item.id
                                                                                                                )
                                                                                                        );
                                                                                            }}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel
                                                                                        className="text-sm font-normal ml-2">
                                                                                    {item.label}
                                                                                </FormLabel>
                                                                            </FormItem>
                                                                    )}
                                                            />
                                                    ))}
                                                </div>

                                                {/* Second set of items */}
                                                <div className="flex flex-col items-start space-y-3">
                                                    <div className="bg-pink p-2 rounded-md">
                                                        <h1 className='text-white font-bold'>SATURDAY</h1>
                                                    </div>
                                                    {items.slice(4, 8).map((item) => (
                                                            <FormField
                                                                    key={item.id}
                                                                    control={form.control}
                                                                    name="items"
                                                                    render={({field}) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                            checked={field.value?.includes(item.id)}
                                                                                            onCheckedChange={(checked) => {
                                                                                                return checked
                                                                                                        ? field.onChange([...field.value, item.id])
                                                                                                        : field.onChange(
                                                                                                                field.value?.filter(
                                                                                                                        (value) => value !== item.id
                                                                                                                )
                                                                                                        );
                                                                                            }}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel
                                                                                        className="text-sm font-normal ml-2">
                                                                                    {item.label}
                                                                                </FormLabel>
                                                                            </FormItem>
                                                                    )}
                                                            />
                                                    ))}
                                                </div>

                                                {/* Third set of items */}
                                                <div className="flex flex-col items-start space-y-3">
                                                    <div className="bg-pink p-2 rounded-md">
                                                        <h1 className='text-white font-bold'>SUNDAY</h1>
                                                    </div>
                                                    {items.slice(8, 12).map((item) => (
                                                            <FormField
                                                                    key={item.id}
                                                                    control={form.control}
                                                                    name="items"
                                                                    render={({field}) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                            checked={field.value?.includes(item.id)}
                                                                                            onCheckedChange={(checked) => {
                                                                                                return checked
                                                                                                        ? field.onChange([...field.value, item.id])
                                                                                                        : field.onChange(
                                                                                                                field.value?.filter(
                                                                                                                        (value) => value !== item.id
                                                                                                                )
                                                                                                        );
                                                                                            }}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel
                                                                                        className="text-sm font-normal ml-2">
                                                                                    {item.label}
                                                                                </FormLabel>
                                                                            </FormItem>
                                                                    )}
                                                            />
                                                    ))}
                                                </div>
                                            </div>

                                            <FormMessage/>
                                        </FormItem>
                                )}
                        />
                        <Button type="submit" className="flex justify-center items-center">Submit</Button>
                    </form>
                </Form>
            </div>
    );
}