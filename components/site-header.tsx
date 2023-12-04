import Link from "next/link"

import { siteConfig } from "@/components/config/config"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import isMobile from "@/components/ui/isMobile"
import { ThemeToggle } from "@/components/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { ShareSite } from "@/components/theme-share"
import { UserContext } from "@/context/UserContext"
import { useContext } from "react"
import { firebase_auth } from "@/firebase/client_side/firebase_init"
import { useRouter } from "next/router"

export function SiteHeader() {
    const { user, setUser, setUserAuth } = useContext(UserContext)
    const router = useRouter()
    const extras = () => {
        if (user && user.firstName !== "") {
            return (
                <>
                    <Button variant="ghost" onClick={() => router.push("/profile").then()} className="flex items-center text-sm font-medium text-muted-foreground">Profile</Button>
                    <Button variant="ghost" onClick={() => router.push("/chat").then()} className="flex items-center text-sm font-medium text-muted-foreground">Chat</Button>
                    <Button variant="ghost" className="flex items-center text-sm font-medium text-muted-foreground" onClick={
                            () => {
                                firebase_auth.signOut().then((r) => {
                                    setUserAuth(null);
                                    setUser(null);
                                });
                            }
                        }
                        >Sign out</Button>
                </>
            );
        }

        // You might want to return null or some default content when the condition is not met
        return <div />;
    }

    function regheader (){
        return (

            <header className="bg-background sticky top-0 z-40 w-full border-b">
                <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                    <MainNav />
                    <div className="flex flex-1 items-center justify-end space-x-4">
                        <nav className="flex items-center space-x-1">
                            {extras()}
                            <Link
                                href={siteConfig.links.github}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <div
                                    className={buttonVariants({
                                        size: "icon",
                                        variant: "ghost",
                                    })}
                                >
                                    <Icons.gitHub className="h-5 w-5" />
                                    <span className="sr-only">GitHub</span>
                                </div>
                            </Link>
                            <ThemeToggle />
                            <ShareSite />
                        </nav>
                    </div>
                </div>
            </header>
            
        )
    }

    function mobileheader () {
        return <header className="bg-background sticky top-0 z-40 w-full border-b">
            <div className="container flex h-16 items-center space-x-4 justify-between sm:space-x-0">
                <MainNav />


                <DropdownMenu>
                    <DropdownMenuTrigger style={{fontSize: "200%"}}>≡</DropdownMenuTrigger>
                    <DropdownMenuContent className="text-center">
                    <DropdownMenuItem className="justify-center"><Button variant="ghost" onClick={() => router.push("/profile").then()} className="flex items-center text-sm font-medium text-muted-foreground">Profile</Button></DropdownMenuItem>
                    <DropdownMenuItem className="justify-center"><Button variant="ghost" onClick={() => router.push("/chat").then()} className="flex items-center text-sm font-medium text-muted-foreground">Chat</Button></DropdownMenuItem>
                    <DropdownMenuItem className="justify-center"><Button variant="ghost" className="flex items-center text-sm font-medium text-muted-foreground" onClick={() => { firebase_auth.signOut().then((r) => { setUserAuth(null); setUser(null);});}}>Sign out</Button></DropdownMenuItem>
                        <DropdownMenuItem className="justify-center">
                            <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
                                    <div className={buttonVariants({ size: "icon", variant: "ghost", })}>
                                        <Icons.gitHub className="h-5 w-5" />
                                        <span className="sr-only">GitHub</span>
                                    </div>
                            </Link> 
                            <ThemeToggle /> 
                           <ShareSite/>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
  
                 


            </div>
        </header>
    }

    return (
        <>
        {isMobile()?mobileheader():regheader()}
        </>
    )
}