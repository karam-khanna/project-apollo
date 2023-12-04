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
import {useRouter} from "next/router"
import {UserContext} from "@/context/UserContext";
import {Interest} from "@/interfaces"
import {Card} from "@/components/ui/card";

//Creating labels for all time slots
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

//Creating form schema where values will be selected 
const FormSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
})


//Using and exporting Checkbox Function from shadcn
export default function CheckboxReactHookFormMultiple() {

    const {user} = useContext(UserContext);
    const router = useRouter()
    console.log(user)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: []
        },
    })

    useEffect(() => {
        // Redirect if user onboarding not updated
        if (user && user?.firstName === "") {
            console.log("User onboarding not updated");
            router.reload();
        }

        // Fetch default items from API
        const fetchDefaultItems = async () => {
            try {
                const res = await fetch(`/api/users/${user?.id}/availability`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                console.log("data zzz", data);

                // Initialize form with fetched data
                form.reset({items: data.items || []});
            } catch (error) {
                console.error("Failed to fetch default items", error);
                // Handle error case, maybe set some default state or show error message
            }
        };

        if (user) {
            fetchDefaultItems();
        }
    }, [user, form, router]);

    //Storing user chosen slots to databse
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (user) {
            let availability = parseAvailability(user, data.items)
            if (availability) {
                const res = await fetch(`/api/users/${user.id}/availability/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(availability),
                })
                console.log("res", await res.json())
            }


            console.log("availability", availability)
            const results: any = []
            const uid: string = availability.userId
            const weekStart: string = availability.weekStart
            const interests: string[] = availability.interests
            for (const key in availability) {
                if (!['userId', 'id', 'weekStart', 'interests'].includes(key)) {
                    if ((availability as any)[key]) {
                        for (const i in interests) {
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

    return (
            <div className="container mx-auto px-4 md:px-10 lg:px-16 xl:px-60 py-6">
                <h1 className="text-3xl font-bold mb-4">Select Your Availability</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                        <DayCheckboxSet dayLabel="Friday" items={items.slice(0, 4)} formControl={form.control}/>
                        <DayCheckboxSet dayLabel="Saturday" items={items.slice(4, 8)} formControl={form.control}/>
                        <DayCheckboxSet dayLabel="Sunday" items={items.slice(8, 12)} formControl={form.control}/>
                        <Button type="submit" className="mt-0">Submit</Button>
                    </form>
                </Form>
            </div>
    );
}


interface SelectableButtonProps {
    isSelected: boolean;
    label: string;
    onClick: () => void;
}

const SelectableButton: React.FC<SelectableButtonProps> = ({isSelected, label, onClick}) => {
    return (
            <Button
                    type="button"
                    onClick={onClick}
                    variant={isSelected ? "default" : "outline"}
                    className={`rounded-md p-2 w-full`}>
                {label}
            </Button>
    );
};


interface Item {
    id: string;
    label: string;
}

interface DayCheckboxSetProps {
    dayLabel: string;
    items: Item[];
    formControl: any; // Specify the correct type for formControl
}

const DayCheckboxSet = ({dayLabel, items, formControl}: DayCheckboxSetProps) => {
    return (
            <Card className="bg-background p-4 2xl:p-8 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-3">{dayLabel}</h2>
                <div className="grid grid-cols-2 gap-4">
                    {items.map((item) => (
                            <FormField
                                    key={item.id}
                                    control={formControl}
                                    name="items"
                                    render={({field}) => {
                                        const isSelected = field.value?.includes(item.id);
                                        return (
                                                <SelectableButton
                                                        label={item.label}
                                                        isSelected={isSelected}
                                                        onClick={() => {
                                                            return isSelected
                                                                    ? field.onChange(field.value.filter((value: string) => value !== item.id))
                                                                    : field.onChange([...field.value, item.id]);
                                                        }}
                                                />
                                        );
                                    }}
                            />
                    ))}
                </div>
            </Card>
    );
};