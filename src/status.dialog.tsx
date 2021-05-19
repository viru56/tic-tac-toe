import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { DialogActions } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface StatusDialogProps {
    open: boolean;
    message: string;
    isPlayingWithComputer:boolean;
    username:string;
    friendName:string;
    onClose: () => void;
  }

function StatusDialog(props: StatusDialogProps) {
  const { onClose, message, open, isPlayingWithComputer, username,friendName } = props;
  return (
    <Dialog  TransitionComponent={Transition} aria-labelledby="status-dialog-title" open={open}>
      <DialogTitle id="status-dialog-title"className="mnw-200 text-center" > 
      {message === 'O' ? `${isPlayingWithComputer ? 'You' :username} Win!!!` : message === 'X' ? `${isPlayingWithComputer ? 'Computer' : friendName} Win!!!` : 'Match draw!!!'}
      </DialogTitle>
     
      <DialogActions className="justify-center">
      <Button variant="contained" color="primary" onClick={onClose}>New Match</Button>
      </DialogActions>
    </Dialog>
  );
}
export default StatusDialog;