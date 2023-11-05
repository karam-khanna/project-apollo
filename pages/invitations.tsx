"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";

// Define a schema for a single event response
const EventResponseSchema = z.object({
  type: z.enum(["accept", "decline"]),
});

// Create a dynamic schema based on the events
const createFormSchema = (events: string[]) => {
  const eventSchemas: Record<string, any> = {};
  events.forEach((event) => {
    eventSchemas[event] = EventResponseSchema;
  });
  return z.object({
    events: z.record(z.string(), EventResponseSchema).refine(data => 
      events.every(event => Object.keys(data).includes(event)),
      { message: "All events must have a response." }),
  });
};

//Assume we're getting data from the database
const events = ["Basketball on Saturday at 11 am", "Poker on Sunday at 9 pm", "Basketball on Friday at 3 pm"];

// The form schema based on the events
const FormSchema = createFormSchema(events);
type FormData = z.infer<typeof FormSchema>;

export default function RadioGroupForm() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    router.push('/myevents');
  };

  useEffect(() => {
    // Pre-fill the form with the events
    events.forEach(event => {
      form.setValue(`events.${event}`, { type: "decline" });
    });
  }, [form]);

  return (
    <div className="flex flex-col items-center justify-center pt-16 gap-9">
        <h1 className="text-6xl font-bold text-center"> Invitations </h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}  className="items-center space-y-8">
        {events.map((event) => (
          <FormField
            key={event}
            control={form.control}
            name={`events.${event}.type`}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-pink cursor-pointer ml-2 font-bold ">{event}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="accept" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Accept
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="decline" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Decline
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
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

