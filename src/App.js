import logo from './logo.svg';
import './App.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Break = props =>{
  return(
    <>
  <div id="break-label" className="row text-center">
      <div className="col">
    <h2>Break length</h2>
      </div>
    </div>
      <div className="row text-center">
        <div className="col">
        <FontAwesomeIcon icon={["fas", "long-arrow-alt-up"]} id="break-increment" onClick={props.increment} className="icon"/>
      <div id="break-length" className="inlineSpan">{props.length}</div>
      <FontAwesomeIcon icon={["fas", "long-arrow-alt-down"]} id="break-decrement" onClick={props.decrement} className="icon"/>
      </div>  
       </div>
      </>
  )
}

const Session = props =>{
  return(
  <>
    <div id="session-label" className="row text-center">
      <div className="col">
    <h2>Session length</h2>
         </div>
    </div>
      <div className="row text-center">
        <div className="col">
      
      <FontAwesomeIcon icon={["fas", "long-arrow-alt-up"]} id="session-increment" onClick={props.increment} className="icon"/>
      <div id="session-length" className="inlineSpan">{props.length}</div>
      <FontAwesomeIcon icon={["fas", "long-arrow-alt-down"]} id="session-decrement" onClick={props.decrement} className="icon"/>
  </div>
    </div>
    </>
  )
}
//-------------------------------- FORMATTAZIONE DEL TEMPO -----------------------------------
function formatTime(time) {
  let minutes = Math.floor(time/60);
  let seconds = time % 60;
  
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${minutes}:${seconds}`;
}



//----------- DEFINIZIONE DELL'OROLOGIO VERO E PROPRIO ----------------------------------------

function App() {
  const [breakLength, setBreakLength] = React.useState(5);
  const [breakTimer, setBreakTimer] = React.useState(300);   
  const [sessionLength, setSessionLength] = React.useState(25);
  const [sessionTimer, setSessionTimer] = React.useState(1500); 
  const [play, setPlay] = React.useState(false);
  const [reset, setReset] = React.useState(0);
  const [isSession, setIsSession] = React.useState(true);
  
  
  //-------------GESTISCO INCREMENTO -------------------
  const handleClickIncrement = event => {
    switch (event.target.id) {
      case "break-increment": 
         if(breakLength === 60) {
          event.target.id.disabled = true;
          break;
        } else
        setBreakLength(prev => prev + 1); 
        setBreakTimer(prev => prev + 60);
        break;
      case "session-increment": 
         if(sessionLength === 60) {
          event.target.id.disabled = true;
          break;
        } else
        setSessionLength(prev => prev + 1); 
        setSessionTimer(prev => prev + 60);
        break;
    }
    
  }
     //-------------GESTISCO DECREMENTO -------------------
    const handleClickDecrement = event => {
    switch (event.target.id) {
      case "break-decrement": 
        if(breakLength === 1) {
          event.target.id.disabled = true;
          break;
        } else
          setBreakLength(prev => prev - 1); 
          setBreakTimer(prev => prev - 60);
        break;
      case "session-decrement": 
        if(sessionLength === 1) {
          event.target.id.disabled = true;
          break;
        } else
        setSessionLength(prev => prev - 1); 
        setSessionTimer(prev => prev - 60);
        break;
    }
    
  }
    
 //-------------- GESTISCO TASTO PLAY ----------------
    const handlePressPlay = () => {
           setPlay(prev => !prev);
    }
    
    
    //------------- GESTISTCO TASTO RESET --------------
    const handlePressReset = () => {
      setBreakLength(5);
      setBreakTimer(300);
      setSessionLength(25);
      setSessionTimer(1500);
      setPlay(false);
      setReset(1);
      setIsSession(true);
      document.getElementById('beep').pause();
      document.getElementById('beep').currentTime = 0;
    }
    
    //---------------------------  CONTO ALLA ROVESCIA ----------------------------------
 
    
  React.useEffect(() => {
    
    if(play && isSession) {  //sono nella Session
    console.log(document.getElementById('time-left').innerText);
    let myInterval = setInterval(() => {
      if(sessionTimer <= sessionLength)
        document.getElementById('beep').play();
      if(sessionTimer < sessionLength){  // AAAAAAAAAAAAA DA RIPORTARE A sessionLength!!!!!!
        
        clearInterval(myInterval);
        
        setIsSession(false);
        setSessionTimer(sessionLength*60);
       
      }
      else
      setSessionTimer(prev => prev-1);
  }, 1000)
    return () => {
      clearInterval(myInterval);
    };
}
    if(play && !isSession)
      {
        let myInterval = setInterval(() => {
           if(breakTimer <= breakLength)
             document.getElementById('beep').play();
      if(breakTimer < breakLength){  // AAAAAAAAAAAAA DA RIPORTARE A breakLength!!!!!!!!!!
        clearInterval(myInterval);
        
        setIsSession(true);
        setBreakTimer(breakLength*60);
      }
      else
      setBreakTimer(prev => prev-1);
  }, 1000)
    return () => {
      clearInterval(myInterval);
    };
}
      
                
  },[play,isSession,sessionTimer,breakTimer]);
  
  
  return (
     <div className="banner container-fluid">
      <div id="clock">
      <div className="row">
        <div className="col text-center">
      <h1>My pomodoro clock!</h1>
          <audio id="beep" controls src="https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3" ></audio>
        </div>
        </div>
      <div className="row">
        <div className="col">
      <Break length={breakLength} increment={handleClickIncrement} decrement={handleClickDecrement}/>
       </div>
        <div className="col">
      <Session length={sessionLength} increment={handleClickIncrement} decrement={handleClickDecrement}/>
          
          </div>
        </div>
      <div  className="row">
         <div className="col text-right">
        <h2 id="timer-label">{isSession ? "Session" : "Break"}</h2>
         </div>
        <div id="time-left" className="col text-start">
          {isSession ? formatTime(sessionTimer) : formatTime(breakTimer)}
        </div>
        </div>
        <div className="row text-center">
          <div className="col">
          <FontAwesomeIcon icon={["fas", "play"]} id="start_stop" onClick={handlePressPlay} className="icon"/>
          <FontAwesomeIcon icon={["fas", "history"]} id="reset" onClick={handlePressReset} className="icon"/>
         </div>
         </div> 
      </div>
      </div>
   )
 
}



export default App;
