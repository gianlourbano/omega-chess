import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface CustomDialogProps {
    open: boolean;
    children?: React.ReactNode;
    title: string;
    contentText: React.ReactNode;
    handleContinue: () => void;
    actions?: React.ReactNode;
}

export default function CustomDialog({
    open,
    children,
    title,
    contentText,
    handleContinue,
    actions,
}: Readonly<CustomDialogProps>) {
    return (
        <Dialog open={open}
        sx={{
            "& .MuiDialog-paper": {
                backgroundColor:" rgb(24 24 27 / var(--tw-bg-opacity))",
                color: "var(--text-color)",
                border: "2px solid var(--text-color)",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px 0px var(--text-color)",
            },
            "& .MuiDialogTitle-root": {
                padding: "10px",
                backgroundColor: "var(--background-color)",
                color: "var(--text-color)",
                border: "2px solid var(--text-color)",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px 0px var(--text-color)",
            },
            "& .MuiDialogContent-root": {
                padding: "10px",
                backgroundColor: "var(--background-color)",
                color: "var(--text-color)",
                border: "2px solid var(--text-color)",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px 0px var(--text-color)",
            },
            "& .MuiDialogActions-root": {
                padding: "10px",
                backgroundColor: "var(--background-color)",
                color: "var(--text-color)",
                border: "2px solid var(--text-color)",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px 0px var(--text-color)",
            },
        }}>
            {/* <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"> */}{" "}
            {/*dialog container*/}
            <DialogTitle>{title}</DialogTitle>
            <DialogContent onClick={handleContinue}>
                {" "}
                {/* Main body of modal/dialog */}
                <DialogContentText>
                    {" "}
                    {/* main text */}
                    {contentText}
                </DialogContentText>
                {children} {/* Other content */}
            </DialogContent>
            <DialogActions>
                {/* Dialog action buttons */}
                {/* Force users to make input without option to cancel */}
                {/* <Button onClick={handleClose}>Cancel</Button> */}
                {actions}
                <Button onClick={handleContinue}>Continue</Button>
            </DialogActions>
        </Dialog>
    );
}
