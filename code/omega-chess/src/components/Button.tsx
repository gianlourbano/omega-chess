"use client";
import Link from "next/link";
import Image from "next/image";
import { FormEvent } from "react";

interface ButtonProps {
    color: string;
    onClick?: (e?: FormEvent<Element>) => void;
    children?: React.ReactNode;
    disabled?: boolean;
    link?: string;
    className?: string;
}

const Button = (props: ButtonProps) => {
    const bgColor =
        props.color === "primary"
            ? "bg-green-500 hover:bg-green-600"
        : props.color === "secondary"
            ? "bg-sky-500 hover:bg-sky-600"
        : "";

    return (
        <button
            className={`${bgColor} font-bold py-2 px-4 rounded flex items-center gap-1 justify-center ${props.className}`}
            onClick={props.onClick}
            disabled={props.disabled}
            style={{
                cursor: props.disabled ? "not-allowed" : "pointer",
            }}
        >
            {props.disabled && (
                <Image src="/lock.png" width={32} height={32} alt="lock" />
            )}
            {props.link ? (
                <Link href={props.link}>{props.children}</Link>
            ) : (
                props.children
            )}
        </button>
    );
};

export default Button;
