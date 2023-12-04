import React, { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { LucideHelpCircle, LucideRefreshCcw, LucideSettings } from "lucide-react";
import { OnboardingForm } from "@/components/onboarding/form/onboarding-form";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import useMobileScreen from "@/components/ui/isMobile";


// Onboarding component displaying welcome message and rendering an onboarding form
export default function Onboarding() {
  const isMobile = useMobileScreen();
  // context variables
  const { userAuth, setUserAuth } = useContext(UserContext);
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <h1 className={"text-2xl sm:text-5xl font-semibold pt-7 sm:pt-16"}>
          Welcome to Mutuals 🚀
        </h1>
        <Card className={"mt-8 sm:mt-16 w-11/12 sm:w-1/2 p-3 sm:p-6"}>
          <OnboardingForm setIsLoading={setIsLoading} />
        </Card>
      </div>
    </div>
  );
}

Onboarding.displayName = "Onboarding";
