import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {Label} from "@/components/ui/label"
import {ThemeToggle} from "@/components/theme-toggle";
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/use-toast"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const FormSchema = z.object({
  freeDate: z.date({
    required_error: "Please select a date when you're free.",
  }),
})


// helping us figure out the next weekend dates
function getNextFriday(){
  const today = new Date();
  return new Date (today.setDate(today.getDate()+(4-today.getDay()+7)%7));
}

function isWithinThursdayToMonday(){
  const now = new Date();
  const day = now.getDay(); //0= Sunday
  const hour = now.getHours(); //0-23

  if((day==4 && hour >= 12) || (day>4 && day <=6) || day==0 ) {
    return true;
  }
  return false;
}

export default function CalendarPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You have chosen: ",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data.freeDate, null, 2)}</code>
        </pre>
      ),
    })
  }
 const withinThursdayToMonday = isWithinThursdayToMonday();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {withinThursdayToMonday ? (
          <Label> Come back next week to set availability</Label>
        ): (
          <>
        <FormField
          control={form.control}
          name="freeDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Choose available dates for this weekend!</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                    {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      const nextThursday = getNextFriday();
                      return (
                        date.getTime() > nextThursday.getTime() + 3 * 24 * 60 * 60 * 1000 || 
                        date.getTime() < nextThursday.getTime()
                      );
                    }}                    
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Please choose the dates that work for you this weekend.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        </>
        )}
      </form>
    </Form>
  )
}

