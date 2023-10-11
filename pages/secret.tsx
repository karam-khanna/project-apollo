import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin']})

export default function Home() {
    return (
            <div>
                <div className={"flex flex-col items-center justify-center pt-16 gap-9"}>
                    <h1 className="text-6xl font-bold text-center">Secret Page!</h1>
                    <p>Here we will put admin stuff. Later will add some rules here so only admins can visit this page
                        and take it off the header</p>
                </div>
            </div>

    )
}
