import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {ThemeProvider} from "@/components/theme-provider";
import {SiteHeader} from "@/components/site-header";
import {Toaster} from "@/components/ui/toaster";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {User} from "@/interfaces";
import {UserContext} from "@/context/UserContext";
import {getAuth, onAuthStateChanged, User as FirebaseUser} from "@firebase/auth";
import {getOrCreateUserFromAuth} from "@/utils/client_side/authInterfaces";
import {getUserAuthToken} from "@/utils/client_side/clientUserUtils";
import {firebase_auth} from "@/components/firebase";

export default function App({Component, pageProps}: AppProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userAuth, setUserAuth] = useState<FirebaseUser | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebase_auth, async (currentAuthUser) => {
            setUserAuth(currentAuthUser);
            setLoading(false);
            console.log(currentAuthUser)
            if (currentAuthUser) {
                setUser(await getOrCreateUserFromAuth(currentAuthUser));
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userAuth && user && !user?.onboarded && router.isReady && router.pathname !== '/onboarding') {
            router.push('/onboarding').then();
        }
    })

    useEffect(() => {
        if (!userAuth && router.isReady && router.pathname !== '/login' && router.pathname !== '/signup') {
            router.push('/login').then();
        }
    }, [userAuth, router]);
    return (
            <UserContext.Provider value={{userAuth: userAuth, setUserAuth: setUserAuth, user: user, setUser: setUser}}>
                <ThemeProvider attribute="class" defaultTheme="dark">
                    <div className="relative flex min-h-screen flex-col">
                        <SiteHeader/>
                        <div className="flex-1">
                            <Component {...pageProps} />
                            <Toaster/>
                        </div>
                    </div>
                </ThemeProvider>
            </UserContext.Provider>

    )
}
