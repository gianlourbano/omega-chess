"use client"

import { useState } from "react"
import Button from "../Button"
import Spinner from "../Spinner"
import { useRouter } from "next/navigation"

const PlayDarkboardButton = () => {
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const handleClick= () => {
        setIsLoading(true)
        fetch("/api/games/lobby", {
            method: "POST",
            body: JSON.stringify({
                gameType: "darkboard",
                player: "gianlo"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
        .then(data => {
            const id = data.id;
            router.push(`/kriegspiel/${id}`)
        })
        .catch(err => console.log(err))
        .finally(() => setIsLoading(false))
    }
    
    return (
        <Button color="secondary" onClick={handleClick}>
            {isLoading ? <Spinner /> : " Play with Darkboard"}
        </Button>
    )
}

export default PlayDarkboardButton