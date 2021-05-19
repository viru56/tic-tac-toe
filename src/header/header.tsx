import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


export interface HeaderProps {
    username?: string
  }

export default function Header(props: HeaderProps) {
    const { username } = props;
  return (
      <AppBar data-testid="app-header">
        <Toolbar>
          <Typography variant="h6" className="title">
            Tic Tac Toe
          </Typography>
          {username &&
            <Typography variant="button">
                Hi {username }
            </Typography>
            }
        </Toolbar>
      </AppBar>
  );
}
