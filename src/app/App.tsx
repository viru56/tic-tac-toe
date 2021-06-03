import React, { Component } from 'react';

import NameDialog from '../name.dialog';
import Header from '../header/header';
import Board from '../board/board';
import { io } from "socket.io-client";

type AppState = {
  numberOfRows:number;
  username:string;
  openNamedialog:boolean;
  socket:any;
  roomId:string;
}
class App extends Component{
  state:AppState = {
    numberOfRows:3,
    username:"",
    openNamedialog:true,
    socket:null,
    roomId:""
  }
   componentDidMount(){
    const socket = io('http://localhost:3002');
    this.setState({socket});
    // listen for room joined
  }
  handleNamedialogClose = (username:string) =>{
    this.setState({
      username,
      openNamedialog:false
    });
    if(window.location.search){
      const roomId = window.location.search.split("=")[1];
      this.setState({roomId});
      this.state.socket.emit('join-friend', roomId,username);
    }
  }
  render(){
    return (
      <>
      <Header username={this.state.username}/>
      <Board roomId={this.state.roomId} socket={this.state.socket} numberOfRows={this.state.numberOfRows} username={this.state.username}/>
      <NameDialog open={this.state.openNamedialog} onClose={this.handleNamedialogClose}/>
      </>
    )
  }
}

export default App;
