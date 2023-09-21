import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {Head} from "next/document";
import {ThemeProvider} from "@/components/theme-provider";
import {SiteHeader} from "@/components/site-header";
import {Toaster} from "@/components/ui/toaster";

export default function App({Component, pageProps}: AppProps) {
    return (
            <ThemeProvider attribute="class" defaultTheme="dark">
                <div className="relative flex min-h-screen flex-col">
                    <SiteHeader/>
                    <div className="flex-1">
                        <Component {...pageProps} />
                        <Toaster/>
                    </div>
                </div>
            </ThemeProvider>

    )
}
