import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "@/context/UserContext";
import {Button} from "@/components/ui/button";
import {LucideHelpCircle, LucideRefreshCcw, LucideSettings} from "lucide-react";
// import {OnboardingForm} from "@/components/onboarding/form/onboarding-form";
import {Card, CardContent, CardDescription} from "@/components/ui/card";
import useMobileScreen from "@/components/ui/isMobile";

export default function Onboarding() {
    const isMobile = useMobileScreen();
    // context variables
    const {userAuth, setUserAuth} = useContext(UserContext);
    const {user, setUser} = useContext(UserContext);
    // If the primaryColor is in HSL format, convert it to Hex.
    return (
            <div>
                <div className="flex flex-col items-center justify-center">
                    {/*<div className="container flex flex-col items-center justify-center lg:pt-16">*/}
                    <h1 className={"text-2xl sm:text-5xl font-semibold pt-7 sm:pt-16"}>Welcome to Mutuals
                        🚀</h1>
                    <Card className={"mt-8 sm:mt-16 w-11/12 sm:w-1/2 p-3 sm:p-6"}>
                        {/*<OnboardingForm setIsLoading={setIsLoading}/>*/}
                    </Card>
                    {/*</div>*/}
                </div>
            </div>
    );
}
Onboarding.displayName = 'Onboarding';