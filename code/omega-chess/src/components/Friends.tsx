"use client";

import { useState } from "react";
import CustomLink from "./CustomLink";
import Button from "./Button";
import styles from "@/styles/Profile.module.css";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Menu } from "@headlessui/react";

function Friends() {
    const [adding, setAdding] = useState(false);
    const [toAdd, setToAdd] = useState("");
    const { data: session, update } = useSession();
    const [notAdded, setNotAdded] = useState("");

    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data, error, isLoading, mutate } = useSWR(
        session ? `/api/users/${session?.user.username}` : null,
        fetcher
    );

    async function addFriend(us: string) {
        const response = await fetch(`/api/users/${session?.user.username}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newFriend: us,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res.error);
                if (res.error) {
                    setNotAdded(res.error);
                } else {
                    setNotAdded("");
                    update();
                    mutate();
                }
            });
    }

    async function removeFriend(us: string) {
        const response = await fetch(`/api/users/${session?.user.username}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                removeFriend: us,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res === "User not found.") {
                    console.log("Friend NOT removed");
                } else {
                    update();
                    mutate();
                    console.log("Friend removed");
                }
            });
    }

    const handleOpen = () => {
        setAdding(!adding);
        setNotAdded("");
    };

    return (
        <main
            className={`${styles.friends} rounded-lg bg-zinc-900 sm:pt-10 pt-5`}
        >
            <div className="static flex flex-col gap-2 justify-evenly">
                <h1 className="font-bold text-3xl flex items-center justify-center pb-3">
                    {" "}
                    Friends:{" "}
                    {data?.user?.friends ? data?.user?.friends.length : 0}{" "}
                </h1>
            </div>
            <Menu
                as="div"
                className="pt-3 pb-3 rounded-lg gap-2 flex flex-col justify-center"
            >
                <Menu.Button
                    onClick={() => {
                        handleOpen;
                    }}
                    onTouchStart={(e) => e.preventDefault()}
                    className="mx-auto rounded-md bg-green-500 hover:bg-green-600 font-bold py-2 px-4 items-center gap-1"
                >
                    Add friend
                </Menu.Button>
                <Menu.Items
                    className="pl-3 pr-3 flex gap-3 flex-col mt-2 w-full justify-center items-center rounded-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <label className="text-white font-bold sm:text-xl text-lg">
                        Username:
                    </label>
                    <input
                        className="w-full text-white bg-zinc-600 rounded-md pl-2 pr-2"
                        id="Username"
                        type="username"
                        name="Username"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setToAdd(e.target.value)}
                    />
                    <Button
                        className="mx-auto"
                        color="primary"
                        onClick={() => addFriend(toAdd)}
                    >
                        {" "}
                        Request{" "}
                    </Button>
                    {notAdded && (
                        <div className="text-center text-red-500">
                            {" "}
                            {notAdded}{" "}
                        </div>
                    )}
                </Menu.Items>
            </Menu>
            <ul className="sm:pl-6 sm:pr-6 pl-4 pr-4 pt-2 overflow-y-auto">
                {data?.user?.friends.map((friend: { username: string }) => (
                    <li
                        key={friend.username}
                        className="flex justify-between items-center pb-2"
                    >
                        <CustomLink
                            href={`/users/${friend.username}`}
                            className="font-bold text-xl"
                        >
                            {friend.username}
                        </CustomLink>
                        <Button
                            color="secondary"
                            onClick={() => removeFriend(friend.username)}
                        >
                            -
                        </Button>
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default Friends;
