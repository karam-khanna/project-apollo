import {Inter} from 'next/font/google'

import { useState } from 'react';
import SecretSetting from './SecretSetting';
import SecretProfile from './SecretProfile';

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const [currtab, setcurrtab] = useState('Home')
    return (
        <div className="flex min-h-screen">
        <aside className= {`w-1/6  p-4 bg-opacity-50 bg-neutral-700`} >
          <ul className='flex flex-col gap-4'>
            <li onClick={()=>setcurrtab("Home")}><a href="#">Home</a></li>
            <li onClick={()=>setcurrtab("Profile")}><a href="#">Profile</a></li>
            <li onClick={()=>setcurrtab("Setting")}><a href="#">Setting</a></li>
          </ul>
        </aside>
      
       
        <main className="w-3/4 p-4">
            {/* {currtab === 'Home' && <SecretHome />} */}
            {currtab === 'Profile' && <SecretProfile />}
            {currtab === 'Setting' && <SecretSetting />}
        </main>
      </div>

    )
}
