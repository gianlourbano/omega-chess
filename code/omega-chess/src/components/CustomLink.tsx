import Link from "next/link";
import Image from "next/image";

interface CustomLinkProps {
    href: string;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    target?: string;
    icon?: string,
}

const CustomLink = (props: CustomLinkProps) => {
    return (
        <Link href={props.href} target={props.target} className={`flex items-center ${props.className}`} 
            style={{
                pointerEvents: props.disabled ? "none" : "auto",
                opacity: props.disabled ? "0.5" : "1",
            
            }}
        >
            {props.disabled && <Image src="/lock.png" width={32} height={32} alt="lock" />}
            {props.icon && <Image src={props.icon} width={32} height={32} alt="icon" />}
            {props.children}</Link>
    )
}

export default CustomLink;