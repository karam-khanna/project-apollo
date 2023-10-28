import * as React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"

export default function Loading() {
    const [progress, setProgress] = React.useState(13)
 
    React.useEffect(() => {
        const timer = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= 100) {
              clearInterval(timer);
              return 100;
            } else {
              return prevProgress + 1;
            }
          });
        }, 1);
        
    return () => clearTimeout(timer)
  }, [])
  return (
    <div>
        <div className="flex flex-col items-center justify-center pt-16 gap-9">
        <h1 className="text-6xl font-bold text-center"> Loading... </h1>
      <Progress value={progress} className="w-[60%]" />
      </div>
    </div>
  );
}
