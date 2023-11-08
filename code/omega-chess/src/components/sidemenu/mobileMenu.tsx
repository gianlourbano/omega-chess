"use client";

import { useState } from "react";
import Drawer from "@mui/material/Drawer/Drawer";
import Menu from "@/components/sidemenu/menu";
import Button from "@/components/Button";

const MobileMenu = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="sm:hidden z-[1000] flex flex-row items-center bg-zinc-900 sticky top-0  w-full text-center text-stone-50 h-16">
            <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
                <Menu onOpen={() => setOpen(false)} />
            </Drawer>
            <Button
                color="secondary"
                onClick={() => setOpen(true)}
                className="ml-2 bg-green-500 text-slate-50"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>
            </Button>
        </div>
    );
};

export default MobileMenu;
