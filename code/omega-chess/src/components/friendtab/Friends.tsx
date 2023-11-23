"use client";

import { useState } from "react";
import CustomLink from "../CustomLink";
import Button from "../Button";
import styles from "@/styles/Profile.module.css";
import { useSession } from "next-auth/react";
import useSWR from "swr";

function Friends () {

    const [adding, setAdding] = useState(false);
    const [toAdd, setToAdd] = useState("");
    const { data: session, update } = useSession();

    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data, error, isLoading, mutate } = useSWR(session ? `/api/users/${session?.user.username}` : null, fetcher);

    async function addFriend(us: string) {
        const response = await fetch(`/api/users/${session?.user.username}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                newFriend: us
            })
        }).then(res => res.json()).then((res) => {
            console.log(res);
            if (res === "User not found.") {
                // Handle error
                console.log('Friend NOT added');
            } else {
                update();
                mutate();
                console.log('Friend added');
            };
        });
    }

    async function removeFriend(us: string) {
        console.log(us);
        const response = await fetch(`/api/users/${session?.user.username}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                removeFriend: us
            })
        }).then(res => res.json()).then((res) => {
            console.log(res);
            if (res === "User not found.") {
                // Handle error
                console.log('Friend NOT removed');
            } else {
                update();
                mutate();
                console.log('Friend removed');
            };
        });
    }


    return (
        <main className={`${styles.friends} bg-zinc-900 sm:pt-10 sm:pl-10 pt-5 pr-5 pl-5`}>
            <div className="static flex flex-col gap-2 justify-evenly pb-3">
                <h1 className="font-bold text-3xl flex items-center justify-center pb-3"> Friends </h1>
                <div className="flex flex-col gap-2 justify-evenly">
                    <Button color="primary" onClick={() => setAdding(!adding)}>
                        Add Friend
                    </Button>
                    {adding &&
                    <div className="gap-3 p-2 rounded-md flex flex-col items-center bg-zinc-800">
                        <label className="text-slate-50">Username:</label>
                        <input className="text-slate-800 text-white bg-zinc-700 rounded-md pl-2 pr-2"
                            id="AddFriend"
                            type="username"
                            name="Add Friend"
                            onChange={(e) => setToAdd(e.target.value)}
                        />
                        <div className="flex justify-center pb-2">
                            <Button color="secondary" onClick={() => addFriend(toAdd)}>
                                Request
                            </Button>
                        </div>
                    </div>
                }
                </div>
            </div>
            <ul>
                {data?.user?.friends.map((friend: { username: string }) => (
                    <li key={friend.username} className="flex justify-between items-center pb-2">
                        <CustomLink
                            href={`/users/${friend.username}`}
                            className="font-bold text-xl">
                                {friend.username}
                        </CustomLink>
                        <Button color="secondary" onClick={() => removeFriend(friend.username)}>
                            Remove
                        </Button>
                    </li>
                ))}
            </ul>
        </main>
    )
};

export default Friends;