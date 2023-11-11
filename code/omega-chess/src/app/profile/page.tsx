"use client";

import { useState } from "react"
import Image from "next/image"
import FriendList from "@/components/FriendList";
import Button from "@/components/Button"
import styles from "@/styles/Profile.module.css"

function ProfilePage() {
    
    const [description, setDescription] = useState("");
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    }

    return (
        <main className= {`h-full w-full ${styles.container}`}>
            <div className={`sm:pt-10 sm:pl-10 pt-5 pr-5 pl-5 ${styles.profile}`}>
                <div className="flex flex-row justify-left items-center">
                    <Image className="rounded-md"
                        src="/board.png"
                        width={100}
                        height={100}
                        alt="board"
                    />
                    <div className="flex-col items-center justify-center pl-3 sm:pl-5">
                        <h1 className="text-4xl font-bold"> test </h1>
                    </div>
                </div>
                <div className="flex-row pt-7">
                    <textarea
                        className="mt-1 text-black block w-full border-gray-300 rounded-md"
                        id="description"
                        name="profile_description"
                        rows={4}
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                </div>
            </div>
            <div className={`sm:pt-10 sm:pl-10 pt-5 pr-5 pl-5 sm:text-5xl text-2xl flex ${styles.stats} justify-center items-center`}>
                [statistiche]
            </div>
            <FriendList friends={["test1", "test2", "test3"]} />
        </main>
    )
    
}

export default ProfilePage;