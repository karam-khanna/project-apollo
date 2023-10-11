"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {useForm} from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Label} from "@/components/ui/label";
import {
    updateUserFirstName, updateUserInterest,
    updateUserLastName,
    updateUserOnboarded
} from "@/utils/client_side/clientDbInterface";
import {UserContext} from "@/context/UserContext";
import {router} from "next/client";
import {useRouter} from "next/router";
import {CardContent, CardDescription} from "@/components/ui/card";
import {getUserAuthToken} from "@/utils/client_side/clientUserUtils";
import {useToast} from "@/components/ui/use-toast";
import {Interest} from "@/interfaces";
import {Checkbox} from "@/components/ui/checkbox";

const interestEnum = z.enum(["poker", "basketball"])
type interestEnum = z.infer<typeof interestEnum>;


const interests = [
    {
        id: "poker",
        label: "Poker",
    },
    {
        id: "basketball",
        label: "Basketball",
    },
] as const


const formSchema = z.object({
    firstName: z.string().min(2, {
        message: "First name",
    }),
    lastName: z.string().min(2, {
        message: "Last name",
    }),
    interests: z.array(z.string()).refine((value) => value.some((interest) => interest), {
        message: "You have to select at least one item.",
    }),


})

export interface OnboardingFormProps {
    setIsLoading: Dispatch<SetStateAction<boolean>>
}

export function OnboardingForm(props: OnboardingFormProps) {
    const {toast} = useToast()
    const router = useRouter()

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            interests: []
        },
    })
    const {user, setUser} = useContext(UserContext);

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (user) {
            props.setIsLoading(true);
            let firstName = values.firstName
            let lastName = values.lastName
            const userInterests = values.interests
            if (firstName === "" || lastName === "") {
                toast({
                    title: "Oops! You forgot to enter your name",
                    description: "Try submitting again",
                })
                return
            }

            console.log("values", values)

            // check if interests contains poker
            if (userInterests.includes("poker")) {
                await updateUserInterest(user, "poker" as Interest, true, setUser)
            } else {
                await updateUserInterest(user, "poker" as Interest, false, setUser)
            }

            // check if interests contains basketball
            if (userInterests.includes("basketball")) {
                await updateUserInterest(user, "basketball" as Interest, true, setUser)
            } else {
                await updateUserInterest(user, "basketball" as Interest, false, setUser)
            }

            await updateUserFirstName(user, values.firstName, setUser)
            await updateUserLastName(user, values.lastName, setUser)
            await updateUserOnboarded(user, true, setUser)
            router.push('/calendarpage').then();

        } else {
            toast({
                title: "Oops! Something went wrong",
                description: "Try submitting again, or reloading the page",
            })
        }
    }


    return (
            <div>
                <Form {...form}>
                    {/*<h1 className={"text-2xl"}>To start, let’s get your Canvas URL</h1>*/}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                                control={form.control}
                                name="firstName"
                                render={({field}) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                )}
                        />
                        <FormField
                                control={form.control}
                                name="lastName"
                                render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                <div className={"container pl-0 gap "}>
                                                    <h2>Last Name</h2>
                                                </div>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                )}
                        />
                        <FormField
                                control={form.control}
                                name="interests"
                                render={({field}) => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">Interests</FormLabel>
                                                <FormDescription>
                                                    {"Select the activities you're interested in"}
                                                </FormDescription>
                                            </div>
                                            {interests.map((interest) => (
                                                    <FormField
                                                            key={interest.id}
                                                            control={form.control}
                                                            name="interests"
                                                            render={({field}) => {
                                                                return (
                                                                        <FormItem
                                                                                key={interest.id}
                                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                                        >
                                                                            <FormControl>
                                                                                <Checkbox
                                                                                        checked={field.value?.includes(interest.id)}
                                                                                        onCheckedChange={(checked) => {
                                                                                            return checked
                                                                                                    ? field.onChange([...field.value, interest.id])
                                                                                                    : field.onChange(
                                                                                                            field.value?.filter(
                                                                                                                    (value) => value !== interest.id
                                                                                                            )
                                                                                                    )
                                                                                        }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormLabel className="font-normal">
                                                                                {interest.label}
                                                                            </FormLabel>
                                                                        </FormItem>
                                                                )
                                                            }}
                                                    />
                                            ))}
                                            <FormMessage/>
                                        </FormItem>
                                )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
    )
}
