import Image from 'next/image'
import {Inter} from 'next/font/google'
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Label} from "@/components/ui/label"

const inter = Inter({subsets: ['latin']})

export default function Home() {
    return (
            <div className={"flex flex-col items-center justify-center pt-16 gap-9"}>
                <h1 className="text-6xl font-bold">Welcome to Mutuals!</h1>
                <div className={"flex flex-col items-center justify-center gap-2"}>
                    <Button onClick={
                        () => {
                            console.log("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                            console.log("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                            console.log("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                            console.log("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                        }
                    }> Click me</Button>
                    <h3 className={"text-2xl font-medium"}>Check console for result</h3>
                </div>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>This is a sample card</CardTitle>
                        <CardDescription>See a fun weekend event here</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                        <Button>Accept</Button>
                        <Button variant="outline">Decline</Button>
                    </CardFooter>
                </Card>

            </div>

    )
}
