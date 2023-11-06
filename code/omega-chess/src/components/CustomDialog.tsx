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
    contentText: string;
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
}: CustomDialogProps) {
    return (
        <Dialog open={open}>
            {" "}
            {/*dialog container*/}
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
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
