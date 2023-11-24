"use client";

import Button from "@/components/Button";
import API from "@/components/Developer/API";
import { useSession } from "next-auth/react";

import { redirect } from "next/navigation";

const UserView = () => {
    const { data: session, update } = useSession();

    const becomeDeveloper = async () => {
        await fetch(`/api/users/${session?.user.username}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                developer: true,
            }),
        })
            .catch((err) => console.log(err))
            .finally(() => {
                update({ ...session, user: { ...session?.user, role: "developer" }});
                console.log(session?.user.role)
                redirect(`/developer/${session?.user.username}`);
            });
    };

    return (
        <section>
            <p>Welcome, {session?.user.username}!</p>
            <p>Begin now!</p>
            <Button color="primary" onClick={() => becomeDeveloper()}>
                Become a developer
            </Button>
        </section>
    );
};

const GuestView = () => {
    return (
        <section>
            <p>Sign up to use our fast and easy to use APIs</p>
        </section>
    );
};

export default function Page() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p>Loading...</p>;

    if (status === "authenticated" && session?.user.role === "developer")
        redirect(`/developer/${session?.user.username}`);

    return (
        <main className="p-5">
            <h1 className="text-4xl">Omega Chess API</h1>
            {status === "authenticated" ? <UserView /> : <GuestView />}
            <API />
        </main>
    );
}
