"use client";

import Image from "next/image";
import FriendList from "@/components/FriendList";
import Edit from "@/app/profile/Edit";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Button from "@/components/Button";
import styles from "@/styles/Profile.module.css";
import useSWR from "swr";
import Spinner from "@/components/Spinner";

function ProfilePage() {
    const { data: session, status, update } = useSession();
    const [editing, setEditing] = useState(false);

    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data, error, isLoading } = useSWR(session ? `/api/users/${session?.user.username}` : null, fetcher);

    if (isLoading) return <div className="h-full w-full flex items-center justify-center"> <Spinner /> </div>

    console.log(data);

    if (session) return (
        <main className= {`h-full w-full ${editing ? styles.container_edit : styles.container}`}>
            <div className={`flex items-center justify-between sm:pt-10 sm:pl-10 pt-5 pr-5 pl-5 ${styles.profile}`}>
                <div className="flex flex-row justify-left items-center">
                    <Image className="rounded-md"
                        src="/board.png"
                        width={100}
                        height={100}
                        alt="board"
                    />
                    <div className="flex-col items-center justify-center pl-3 sm:pl-5">
                        <h1 className="text-4xl font-bold"> {session?.user.username} </h1>
                    </div>
                </div>
                <div className="">
                    <Button color="primary" onClick={() => setEditing(!editing)}>
                        Edit Profile
                    </Button>
                </div>
            </div>
            {editing && <Edit/>}
            <div className={`sm:pt-10 sm:pl-10 pt-5 pr-5 pl-5 sm:text-5xl text-2xl flex ${styles.stats} justify-center`}>
                [statistiche]
            </div>
            <FriendList friends={data.user?.friends} />
        </main>
    ); else redirect("/login");
    
}

export default ProfilePage;