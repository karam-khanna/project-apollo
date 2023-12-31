import { useForm } from "react-hook-form";
import { User } from '@/interfaces'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React, { Dispatch, SetStateAction, useEffect, useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getGroups } from "@/utils/client_side/chatUtils"
import {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { UserContext } from "@/context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod"
import { db } from '@/firebase/client_side/firebase_init';
import { doc, setDoc, Timestamp } from "firebase/firestore"
import * as z from "zod"
import axios from 'axios'

export default function ReportForm() {
    const [groups, setGroups] = useState([""])
    const [metadata, setMetadata] = useState({})
    const [people, setPeople] = useState([])
    const [reporting, setReporting] = useState(false)
    const [done, setDone] = useState(false)
    const { user, setUser } = useContext(UserContext)

    useEffect(() => {
        async function fetchData() {
            try {
                if (user) {
                    const result = await getGroups(user);
                    setGroups(Object.keys(result))
                    setMetadata(result)
                }
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        }
        fetchData();
    }, [user]);


    const formSchema = z.object({
        group: z.string().nonempty("Select a group"),
        reported: z.string().nonempty("Select someone to report"),
        concern: z.string().min(2, {
            message: "describe your concern",
        })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            group: "",
            reported: "",
            concern: "",
        },
    });
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(length: number) {
        let result = ' ';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const ts = Timestamp.fromDate(new Date())
        axios.get('')
        await setDoc(doc(db, 'reports', generateString(10)), {
            "concern": values.concern,
            "reporter": user?.id,
            "group": values.group,
            "reported": values.reported,
            "filed": ts,
        })
        setDone(true)
        setReporting(false)
    }
    if (reporting) {
        return (
            <div>
                <Card className={"absolute top-0 right-2 mt-8 sm:mt-16 w-11/12 p-3 sm:p-6"}>
                    <CardDescription> Reporting Form </CardDescription>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name={'group'}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Group</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a group to report" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {groups.map(group => 
                                                    <SelectItem key={group} value={group}>{group}</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>)}
                            />
                            <FormField
                                control={form.control}
                                name={'reported'}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Who are you reporting?</FormLabel>
                                        <FormControl>
                                            <Input placeholder="who to report" {...field} />
                                        </FormControl>
                                    </FormItem>)}
                            />
                            <FormField
                                control={form.control}
                                name={'concern'}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Concern</FormLabel>
                                        <FormControl>
                                            <Input placeholder="concern" {...field} />
                                        </FormControl>
                                    </FormItem>)}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form >
                </Card>
            </div >
        )
    } else if (done) {
        return (
            <div>
                <Card className={"absolute top-0 right-2 mt-8 sm:mt-16 w-11/12 p-3 sm:p-6"}>
                    <CardDescription>Thank you for submitting your report. We will email you with further information.</CardDescription>
                    <Button onClick={() => setReporting(true)}>Submit Another Report</Button>
                </Card>
            </div>
        )
    } else {
        return (
            <div>
                <Card className={"absolute top-0 right-2 mt-8 sm:mt-16 w-11/12 p-3 sm:p-6"}>
                    <CardDescription>Seeing behavior you don&apos;t like?</CardDescription>
                    <Button onClick={() => setReporting(true)}>Submit a Report</Button>
                </Card>
            </div>
        )
    }

}