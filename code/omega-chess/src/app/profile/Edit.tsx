"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Button from "@/components/Button";
import layout from "@/styles/Profile.module.css";
import styles from "@/styles/Edit.module.css";
import { PUT } from "@/app/api/users/[username]/route";

function Edit () {
    const [newUsername, setUsername] = useState("");
    const [newEmail, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const { data: session, update } = useSession();

    async function updateUser(us: string, mail: string, oldpw: string, newpw:string) {
        const response = await fetch(`/api/users/${session?.user.username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newUsername: us,
                newEmail: mail,
                oldPassword: oldpw,
                newPassword: newpw
            })
        }).then(res => res.json()).then((res) => {
            console.log(res);
            if (res === "OK") {
                // Handle success
                console.log('User updated');
                update();
                redirect("/profile");
            } else {
                // Handle error
                console.log('Failed to update user');
            };
        });
    }

    return (
        <div className={`${layout.edit} items-center m-3 bg-zinc-900 sm:p-5 p-3 rounded-md`}>
            <form className={`${styles.container}`}>
                <div className={`flex justify-between ${styles.username}`}>
                    <label className="text-slate-50">New Username:</label>
                    <input className="text-slate-800 text-white bg-zinc-800 rounded-md pl-2 pr-2"
                        id="Username"
                        type="username"
                        name="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
            
                <div className={`flex justify-between ${styles.email}`}>
                    <label className="text-slate-50">New Email:</label>
                    <input className="text-slate-800 text-white bg-zinc-800 rounded-md pl-2 pr-2"
                        id="Email"
                        type="email"
                        name="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={`flex justify-between ${styles.passwordOld}`}>
                    <label className="text-slate-50">Old Password:</label>
                    <input className="text-slate-800 text-white bg-zinc-800 rounded-md pl-2 pr-2"
                        id="oldPassword"
                        type="password"
                        name="Old Password"
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>
                <div className={`flex justify-between ${styles.passwordNew}`}>
                    <label className="text-slate-50">New Password:</label>
                    <input className="text-slate-800 text-white bg-zinc-800 rounded-md pl-2 pr-2"
                        id="newPassword"
                        type="password"
                        name="New Password"
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
            </form>
            <div className="flex pt-5 justify-center">
                <Button color="secondary" onClick={() => updateUser(newUsername, newEmail, oldPassword, newPassword)} >
                    Save
                </Button>
            </div>
        </div>
    );

}

export default Edit;