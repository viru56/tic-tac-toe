import {Component} from 'react';
import { Container, Grid,Paper,Box,Button, Typography } from '@material-ui/core';
import StatusDialog from '../status.dialog';

type BoardProps  = {
    numberOfRows:number;
    username:string;
    socket:any;
    roomId:string;
}
type BoardState = {
    matchStatus:string;
    isPlaying:boolean;
    isPlayingWithComputer:boolean;
    rowArr:Array<Array<string>>;
    myTurn:boolean;
    friendName:string;
    openNamedialog:boolean;
    gameInitiator:boolean;
    roomId:string;
}
type Cell = {
    rowIndex:number,
    cellIndex:number
}
enum Turn {
    HUMAN='O',
    COMPUTER='X'
}

class Board extends Component<BoardProps, BoardState> {
    state:BoardState = {
        matchStatus:"",
        isPlaying:false,
        isPlayingWithComputer:false,
        rowArr:[],
        myTurn:true,
        friendName:'',
        openNamedialog:false,
        gameInitiator:false,
        roomId: ''
    }
    componentDidMount(){
      this.resetGame();
      this.registerSocketEvent();
    }
    registerSocketEvent = () =>{
      if( this.props.socket){
        console.log("socket event")
        this.props.socket.on('friend-joined',(names:Array<string>)=>{
          const friendName = names[0] === this.props.username ? names[1] : names[0];
          this.setState({friendName,myTurn:this.state.gameInitiator,isPlaying:true});
          console.log("gameInitiator: ",this.state.gameInitiator);
          if(this.props.roomId){
            this.setState({roomId:this.props.roomId});
          }
        });
        this.props.socket.on('friend-move',(data:{rowIndex:number,cellIndex:number})=>{
          const rowArr:Array<Array<string>>= JSON.parse(JSON.stringify(this.state.rowArr)); 
          rowArr[data.rowIndex][data.cellIndex] = this.state.myTurn ? Turn.HUMAN : Turn.COMPUTER;
          const matchStatus =  this.checkForMatchStatus(rowArr);
          this.setState({
            rowArr, 
            myTurn: !this.state.myTurn,
            matchStatus
          });
        })
      }else{
        setTimeout(this.registerSocketEvent, 1000);
      }
    }

    /**
     * reset the game
     */
    resetGame = () =>{
        let rowArr:Array<Array<string>> = [];
        for(let i=0;i< this.props.numberOfRows;i++){
          rowArr[i] = [];
          for(let j=0;j< this.props.numberOfRows;j++){
            rowArr[i][j] = "";
          }  
        }
        this.setState({
          rowArr,
          matchStatus:"",
          isPlaying: !!this.props.roomId,
          isPlayingWithComputer:false,
        });
      }
      /**
       * 
       * @param rowIndex {Number} row index
       * @param cellIndex {Number} cell index
       * @return {void}
       */
      handleCellClick = (rowIndex:number,cellIndex:number): void =>{
        if(this.state.matchStatus || !this.state.isPlaying) return;
        const rowArr:Array<Array<string>>= JSON.parse(JSON.stringify(this.state.rowArr)); 
        rowArr[rowIndex][cellIndex] = this.state.myTurn ? Turn.HUMAN : Turn.COMPUTER;
        const matchStatus =  this.checkForMatchStatus(rowArr);
        this.setState({
          rowArr, 
          myTurn: !this.state.myTurn,
          matchStatus
        });
        if(this.state.isPlayingWithComputer){
            this.handleComputerMove();
        }else{
          console.log("sending message");
          this.props.socket.emit('move', {roomId: this.state.roomId,rowIndex,cellIndex});
        }
        
      }
      
      handleComputerMove = ():void =>{
          setTimeout(()=>{
            const rowArr = JSON.parse(JSON.stringify(this.state.rowArr));
            const {rowIndex,cellIndex} = this.aiTurn(rowArr);
            console.log(rowIndex,cellIndex);
            rowArr[rowIndex][cellIndex] = this.state.myTurn ? Turn.HUMAN : Turn.COMPUTER;
            const matchStatus =  this.checkForMatchStatus(rowArr);
            this.setState({
                rowArr, 
                myTurn: !this.state.myTurn,
                matchStatus
            })
        },1000);
      }
      
      /**
       * check the match status
       *  @param rowArr: {Array<Array<string>>} pass the board array
       * @return {String} X|O|""
       */
      checkForMatchStatus = (rowArr:Array<Array<string>>):string =>{
        let matchStatus = "";
        // check for horizontal
        if(this.equalThree(rowArr[0][0],rowArr[0][1],rowArr[0][2])){
          matchStatus = rowArr[0][0];
        }
        else if(this.equalThree(rowArr[1][0],rowArr[1][1],rowArr[1][2])){
          matchStatus = rowArr[1][0];
        }
        else if(this.equalThree(rowArr[2][0],rowArr[2][1],rowArr[2][2])){
          matchStatus = rowArr[2][0];
        }
        // check for Vertical
        else if(this.equalThree(rowArr[0][0],rowArr[1][0],rowArr[2][0])){
          matchStatus = rowArr[0][0];
        }
        else if(this.equalThree(rowArr[0][1],rowArr[1][1],rowArr[2][1])){
          matchStatus = rowArr[0][1];
        }
        else if(this.equalThree(rowArr[0][2],rowArr[1][2],rowArr[2][2])){
          matchStatus = rowArr[0][2];
        }
        // check for Diagonal
        else if(this.equalThree(rowArr[0][0],rowArr[1][1],rowArr[2][2])){
          matchStatus = rowArr[0][0];
        }
        else if(this.equalThree(rowArr[0][2],rowArr[1][1],rowArr[2][0])){
          matchStatus = rowArr[0][2];
        }
        else{
            matchStatus = this.checkForDraw(rowArr);
        }
        return matchStatus;
      }
      /** 
       * check for match draw
       * @param rowArr: {Array<Array<string>>} pass the board array
       * @return {Boolean} 
       */
      checkForDraw = (rowArr:Array<Array<string>>):string =>{
        let isDraw = true;
        rowArr.forEach((row:Array<string>)=>{
          if(row.indexOf("") !== -1){
            isDraw = false;
          }
        })
        return isDraw ? 'tie':"";
      }
      /**
       * check the equality between three values
       * @param a {String} the first element you want to check equality  
       * @param b {String} the second element you want to check equality  
       * @param c {String} the third element you want to check equality  
       * @return {Boolean} 
       */
      equalThree = (a:string,b:string,c:string): boolean => (a === b && a===c);

      playWithComputer = ():void =>{
        this.setState({
          isPlaying: true,
          isPlayingWithComputer:true
        })
      }
      playWithFriend = ():void =>{
        const roomId =  new Date().getTime().toString();
        this.props.socket.emit('join-room',roomId,this.props.username);
        console.log("room joind", roomId);
        alert("http://localhost:3000?roomId="+roomId);
        this.setState({gameInitiator:true,roomId});
      }
      /** 
       * Find the bast possible move with will lead to draw or to win Computer
       * @param rowArr: {Array<Array<string>>} pass the board array
       * @return {Object} 
       */
      aiTurn = (rowArr:Array<Array<string>>):Cell =>{
        // Computer to make its turn
        let bestScore = -Infinity;
        let move:Cell ={rowIndex:0,cellIndex:0};
        for (let rowIndex = 0; rowIndex < this.props.numberOfRows; rowIndex++) {
            for (let cellIndex = 0; cellIndex < this.props.numberOfRows; cellIndex++) {
              // Is the spot available?
              if (rowArr[rowIndex][cellIndex] === '') {
                rowArr[rowIndex][cellIndex] = this.state.myTurn ? Turn.HUMAN : Turn.COMPUTER;
                // check for the best cell to win for Computer
                let score = this.minimax(rowArr, 0, false);
                rowArr[rowIndex][cellIndex] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = {rowIndex,cellIndex}
                }
              }
            }
          }
        return move;
      }
      
      /** 
       * check for all possible ways to win 
       * @param rowArr {Array<Array<string>>}
       * @param depth {Number} current depth of board 
       * @param isMaximizing {Boolean} true : increasing the chance to win for ai or reducing winning chance of human
       * @returns {number}
       */
      minimax = (rowArr:Array<Array<string>>, depth:number,isMaximizing:boolean): number =>{
        let result:string = this.checkForMatchStatus(rowArr);
        if (result) {
            return result === 'X' ? 10 : result === 'O' ? -10 : 0;
          }
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < this.props.numberOfRows; i++) {
              for (let j = 0; j < this.props.numberOfRows; j++) {
                // Is the spot available?
                if (rowArr[i][j] === '') {
                    rowArr[i][j] = this.state.myTurn ? Turn.HUMAN : Turn.COMPUTER;
                  let score = this.minimax(rowArr, depth + 1, false);
                  rowArr[i][j] = '';
                  bestScore = Math.max(score, bestScore);
                }
              }
            }
            return bestScore;
          } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 3; j++) {
                // Is the spot available?
                if (rowArr[i][j] === '') {
                    rowArr[i][j] = this.state.myTurn ? Turn.COMPUTER : Turn.HUMAN;
                  let score = this.minimax(rowArr, depth + 1, true);
                  rowArr[i][j] = '';
                  bestScore = Math.min(score, bestScore);
                }
              }
            }
            return bestScore;
          }
      }
    render(){
        return (
            <Container className="main" maxWidth="sm" data-testid="app-board">
            <Grid container className="mb-2" justify="space-between" alignItems="baseline">
              <Grid item>
                {
                this.state.isPlaying ? 
                 <Box>Turn: {this.state.myTurn ? `${this.state.isPlayingWithComputer ? 'Your ':this.props.username} (O)` : `${this.state.isPlayingWithComputer ? 'Computer':this.state.friendName}(X)`}</Box>
                 :
                  <Button size="small" variant="outlined" color="primary" onClick={this.playWithComputer}>Play with computer</Button>
                }
               
              </Grid>
              {(!this.state.isPlaying && !this.props.roomId) && 
                <Grid item>
                  <Button size="small" disabled={!this.props.socket} variant="contained" color="primary" onClick={this.playWithFriend}>Play with a frined</Button>
                </Grid>
              }
              {this.state.isPlaying &&
              <Grid item>
                <Button size="small" variant="outlined" color="secondary" onClick={this.resetGame}>Reset</Button>
              </Grid>
            }
            </Grid>
            <Paper className="board" data-testid="board">
            {this.state.rowArr.map((row:Array<string>,rowIndex:number)=>(
                <Grid key={rowIndex} container className={`row row${rowIndex}`}>
                {
                row.map((cell,cellIndex)=>(
                    <Grid onClick={()=> (cell || !this.state.myTurn) ? null : this.handleCellClick(rowIndex,cellIndex)} item key={cellIndex} xs={this.props.numberOfRows === 3 ? 4 :2} className={`cell cell${rowIndex}${cellIndex}`}>
                    <Typography color={cell==='X' ? 'secondary': 'textPrimary'} className={cell? "cell-filled" : this.state.isPlaying ? "cell-content" :""}>
                        {cell}
                    </Typography>
                    </Grid>
                ))
                }
                </Grid>
            ))}
            </Paper>
            <StatusDialog open={!!this.state.matchStatus} isPlayingWithComputer={this.state.isPlayingWithComputer} username={this.props.username} friendName={this.state.friendName} message={this.state.matchStatus} onClose={this.resetGame}/>
            {/* <NameDialog open={this.state.openNamedialog} askFriendName={true} onClose={this.handleNamedialogClose}/> */}
          </Container>
        )
    }
}

export default Board;