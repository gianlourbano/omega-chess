"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from "@/components/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSession } from "next-auth/react";

function Edit () {
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");

    const { data: session, update } = useSession();
    const [open, setOpen] = useState(false);

    const theme = createTheme({ components: { MuiDialog: { styleOverrides: { paper: { backgroundColor: '#262424', }, }, }, }, });

    async function updateUser(us: string, mail: string, oldpw: string, newpw:string) {
        fetch(`/api/users/${session?.user.username}`, {
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
            if (res.error) {
                console.log('User NOT updated');
                setError(res.error);
                update();
            } else {
                console.log('User updated');
                setError("");
                setOpen(false);
                update();
            };
        });
    }

    const handleOpen = () => {
        setOpen(true);
    }
    
    const handleClose = async (reason: string) => {
        if (reason === 'escapeKeyDown' || reason === 'cancel') {
            setError("");
            setOpen(false);
        } else if (reason === 'apply') {
            updateUser(newUsername, newEmail, oldPassword, newPassword);
        }
    };
    
    return (
        <ThemeProvider theme={theme}>
            <div>
                <Button color="primary" onClick={handleOpen}>Edit profile</Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle className="font-bold text-2xl text-white">Insert credentials</DialogTitle>
                    <DialogContent>
                    <Box component="form" className="rounded-md" sx={{m: 1, display: 'flex', flexWrap: 'nowrap'}}>
                        <form className="flex sm:flex-col flex-col gap-3">
                            <div className="sm:flex sm:gap-5 justify-between"> 
                                <label className="text-white sm:text-xl text-lg">New Username:</label>
                                <input className="text-white bg-zinc-600 rounded-md pl-2 pr-2"
                                    id="Username"
                                    type="username"
                                    name="Username"
                                    onChange={(e) => setNewUsername(e.target.value)}
                                />
                            </div>
                            <div className="sm:flex sm:gap-5 justify-between"> 
                                <label className="text-white sm:text-xl text-lg">New Email:</label>
                                <input className="text-white bg-zinc-600 rounded-md pl-2 pr-2"
                                    id="Username"
                                    type="username"
                                    name="Username"
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                            </div>
                            <div className="sm:flex sm:gap-5 justify-between"> 
                                <label className="text-white sm:text-xl text-lg">Old Password:</label>
                                <input className="text-white bg-zinc-600 rounded-md pl-2 pr-2"
                                    id="Username"
                                    type="username"
                                    name="Username"
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>
                            <div className="sm:flex sm:gap-5 justify-between"> 
                                <label className="text-white sm:text-xl text-lg">New Password:</label>
                                <input className="text-white bg-zinc-600 rounded-md pl-2 pr-2"
                                    id="Username"
                                    type="username"
                                    name="Username"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-red-500 text-xl text-center">{error}</p>}
                        </form>
                    </Box>
                    </DialogContent>
                    <DialogActions>
                    <Button className="text-white" color="secondary" onClick={() => handleClose('cancel')}>Cancel</Button>
                    <Button className="text-white" color="secondary" onClick={() => handleClose('apply')}>Apply</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </ThemeProvider>
    );
}

export default Edit;