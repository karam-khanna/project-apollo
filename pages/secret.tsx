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
import {ThemeToggle} from "@/components/theme-toggle";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    return (
            <div className={"flex flex-col items-center justify-center pt-16 gap-9"}>
                <h1 className="text-6xl font-bold">El put your shit here</h1>
            </div>

    )
}
