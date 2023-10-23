import React, { Dispatch, SetStateAction, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUserFirstName, updateUserInterest, updateUserLastName, updateUserOnboarded, updateUserPicture, updateUserAge } from "@/utils/client_side/clientDbInterface";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { Interest } from "@/interfaces";
import { Checkbox } from "@/components/ui/checkbox";
import * as z from "zod";

const interestEnum = z.enum(["poker", "basketball"]);
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
] as const;

const ageSchema = z.string().refine((value) => !isNaN(parseInt(value, 10)) && parseInt(value, 10) >= 18, {
  message: "Must be above age of 18 to join.",
});

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
  picture: z.string().optional(),
  age: ageSchema, // Add the age field
});

export interface OnboardingFormProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export function OnboardingForm(props: OnboardingFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      interests: [],
      picture: "",
      age: "", // Initialize the age field
    },
  });
  const { user, setUser } = useContext(UserContext);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (user) {
      props.setIsLoading(true);
      let firstName = values.firstName;
      let lastName = values.lastName;
      const userInterests = values.interests;
      const age = values.age; // Get the age from form values

      if (firstName === "" || lastName === "") {
        toast({
          title: "Oops! You forgot to enter your name",
          description: "Try submitting again",
        });
        return;
      }

      // Check if a picture was uploaded
      if (values.picture) {
        // Assuming the updateUserPicture function takes the user, picture URL, and setUser as parameters.
        await updateUserPicture(user, values.picture, setUser);
      }

      if (userInterests.includes("poker")) {
        await updateUserInterest(user, "poker" as Interest, true, setUser);
      } else {
        await updateUserInterest(user, "poker" as Interest, false, setUser);
      }

      if (userInterests.includes("basketball")) {
        await updateUserInterest(user, "basketball" as Interest, true, setUser);
      } else {
        await updateUserInterest(user, "basketball" as Interest, false, setUser);
      }

      await updateUserFirstName(user, values.firstName, setUser);
      await updateUserLastName(user, values.lastName, setUser);
      await updateUserAge(user, age, setUser); // Update user age
      await updateUserOnboarded(user, true, setUser);
      router.push("/calendarpage").then();
    } else {
      toast({
        title: "Oops! Something went wrong",
        description: "Try submitting again, or reloading the page",
      });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className={"container pl-0 gap "}>
                    <h2>Last Name</h2>
                  </div>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Interests</FormLabel>
                  <FormDescription>{"Select the activities you're interested in"}</FormDescription>
                </div>
                {interests.map((interest) => (
                  <FormField
                    key={interest.id}
                    control={form.control}
                    name="interests"
                    render={({ field }) => {
                      return (
                        <FormItem key={interest.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(interest.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, interest.id])
                                  : field.onChange(field.value?.filter((value) => value !== interest.id));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{interest.label}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Add the input field for uploading a picture */}
          <FormField
            control={form.control}
            name="picture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
