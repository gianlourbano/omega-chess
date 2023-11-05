"use client"
import Link from "next/link";
import Image from "next/image";

interface ButtonProps {
    color: string;
    onClick?: () => void;
    children?: React.ReactNode;
    disabled?: boolean;
    link?: string,
    className?: string,
}

const Button = (props: ButtonProps) => {
    return (
        <button
            className={`bg-${props.color}-500 hover:bg-${props.color}-600 text-white font-bold py-2 px-4 rounded flex items-center gap-1 justify-center ${props.className}`}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            
            {props.disabled && <Image src="/lock.png" width={32} height={32} alt="lock" />}
            {props.link  ? <Link href={props.link}>{props.children}</Link> : props.children}
        </button>
    );
}

export default Button;