import { useRef, useEffect } from "react";

interface AutoScrollBoxProps {
    children?: React.ReactNode;
    className?: string;
    items: any[];
}

const AutoScrollBox = (props: AutoScrollBoxProps) => {
    
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [props.items]);
    
    
    return (
        <div className={`overflow-y-auto flex flex-col gap-1 ${props.className}`}>
            {props.children}
            <div ref={messagesEndRef}></div>
        </div>
    )
}

export default AutoScrollBox