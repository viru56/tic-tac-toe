import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DialogActions, DialogContent, TextField } from '@material-ui/core';

export interface NameDialogProps {
    open: boolean;
    askFriendName?:boolean;
    onClose: (name:string) => void;
  }

function NameDialog(props: NameDialogProps) {
  const { onClose, open,askFriendName } = props;
  const [username,setUsername] = React.useState('');
  const handleClose = (event:React.FormEvent) =>{
    event.preventDefault();
    if(!username.trim()) return;
    onClose(username);
  }
  return (
    <Dialog aria-labelledby="status-dialog-title" open={open} data-testid="app-name-dialog">
       <form noValidate onSubmit={handleClose}>
      <DialogTitle id="status-dialog-title"className="mnw-200 text-center">
      Please tell us {askFriendName ? 'your friend ' : ' your '} name
        </DialogTitle>
     <DialogContent>
       <TextField 
        fullWidth
        margin="normal"
        id="username"
        name="username"
        label="Your name"
        placeholder="Enter your name"
        variant="standard"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
       />
     </DialogContent>
      <DialogActions className="justify-center">
      <Button variant="contained" type="submit" color="primary">Submit</Button>
      </DialogActions>
       </form>
    </Dialog>
  );
}
export default NameDialog;