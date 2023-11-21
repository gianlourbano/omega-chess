import { useEffect } from "react"

const GameTranscript = (props: {transcript: string}) => {
    
    useEffect(() => {
        
    }, [])
    
    return (
        <pre>{props.transcript}</pre>
    )
}

export default GameTranscript;