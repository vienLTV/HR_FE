'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Navbar() {
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        role: ''
    })

    useEffect(() => {
        // This code will only run on the client-side
        const firstName = localStorage.getItem('firstName') || ''
        const lastName = localStorage.getItem('lastName') || ''
        const role = localStorage.getItem('role') || ''
        setUserInfo({ firstName, lastName, role })
    }, [])

    const fullName = `${userInfo.firstName} ${userInfo.lastName}`.trim()

    return (
        <div className="flex items-center justify-between p-4 border-b-2">
            {/* SEARCH */}
            <div className="hidden md:flex items-center gap-2 rounded-full ring-[1.5px] ring-gray-300 px-2">
                <Image src="/search.png" alt="" width={14} height={14} />
                <input type="text" placeholder="Search..." className="w-[200px] p-1 bg-transparent outline-none" />
            </div>

            {/* ICON AND USER */}
            <div className="flex items-center gap-6 justify-end w-full">
                <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                    <Image src="/message.png" alt="" width={20} height={20} />
                </div>
                <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
                    <Image src="/announcement.png" alt="" width={20} height={20} />
                    <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-red-600 text-white rounded-full text-xs">
                        1
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs leading-3 text-[#054FA5] font-bold">{fullName}</span>
                    <span className="text-[10px] text-gray-600 text-right">{userInfo.role}</span>
                </div>
                <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full" />
            </div>
        </div>
    )
}