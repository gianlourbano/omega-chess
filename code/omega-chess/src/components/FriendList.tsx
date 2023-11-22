"use client";

import Button from "./Button";
import CustomLink from "./CustomLink";
import styles from "@/styles/Profile.module.css";

interface FriendListProps {
    friends: string[];
}

const FriendList = (props: FriendListProps) => {
    return (
        <div className={`${styles.friends} bg-zinc-900 sm:pt-10 sm:pl-10 pt-5 pr-5 pl-5`}>
            <div className="flex flex-col justify-evenly pb-4">
                <h1 className="font-bold text-3xl flex items-center justify-center pb-3"> Friends </h1>
                <Button color="primary">
                    Add Friend
                </Button>
            </div>
            <ul>
                {props.friends?.map((friend) => (
                <li className="flex text-xl justify-between pb-2"
                    key={friend}>
                    <CustomLink
                        href={`/profile/${friend.toLowerCase() .replace(" ", "-")}`}
                        className="self-start text-md rounded-md">
                        {friend}
                    </CustomLink>
                    <Button className="text-sm" color="secondary">
                        Remove
                    </Button>
                </li>
                ))}
            </ul>
        </div>
    )
};

export default FriendList;