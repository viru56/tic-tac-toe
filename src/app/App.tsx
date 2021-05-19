import React, { Component } from 'react';

import NameDialog from '../name.dialog';
import Header from '../header/header';
import Board from '../board/board';

type AppState = {
  numberOfRows:number;
  username:string;
  openNamedialog:boolean;
}
class App extends Component{
  state:AppState = {
    numberOfRows:3,
    username:"",
    openNamedialog:true
  }
  handleNamedialogClose = (username:string) =>{
    this.setState({
      username,
      openNamedialog:false
    });
  }
  render(){
    return (
      <>
      <Header username={this.state.username}/>
      <Board numberOfRows={this.state.numberOfRows} username={this.state.username}/>
      <NameDialog open={this.state.openNamedialog} onClose={this.handleNamedialogClose}/>
      </>
    )
  }
}

export default App;
