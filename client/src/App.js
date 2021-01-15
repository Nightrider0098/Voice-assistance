// import logo from './logo.svg';
import React, { useState } from 'react'
import './App.css';

function App() {
  let [speachText, setSpeachText] = useState("")


  let audioIN = { audio: true };
  //  audio is true, for recording 

  // Access the permission for use 
  // the microphone 
  navigator.mediaDevices.getUserMedia(audioIN)

    // 'then()' method returns a Promise 
    .then(function (mediaStreamObj) {


      // Start record 
      let start = document.getElementById('btnStart');

      // Stop record 
      let stop = document.getElementById('btnStop');

      // 1nd audio tag for play the audio 
      let playAudio = document.getElementById('adioPlay');

      // This is the main thing to recorde  
      // the audio 'MediaRecorder' API 


      let mediaRecorder = new MediaRecorder(mediaStreamObj);
      // Pass the audio stream  
      // mediaRecorder.
      // Start event 
      start.addEventListener('click', function (ev) {
        mediaRecorder.start();
        // console.log(mediaRecorder.state); 
      })

      // Stop event 
      stop.addEventListener('click', function (ev) {
        mediaRecorder.stop();
        // console.log(mediaRecorder.state); 
      });

      // If audio data available then push  
      // it to the chunk array 
      mediaRecorder.ondataavailable = function (ev) {
        dataArray.push(ev.data);
        console.log(ev.data)
        if (ev.data)
          fetch("/api/whatWords", {
            method: "POST",
            body: ev.data, headers: { "Content-Type": "audio/webm" }
          }).then(e => e.json()).then(e => {
            setSpeachText(e.text);
          })
        // .then((e) => {
        //   console.log(e.body);
        // })
      }

      // Chunk array to store the audio data  
      let dataArray = [];

      // Convert the audio data in to blob  
      // after stopping the recording 
      mediaRecorder.onstop = function (ev) {

        // blob of type mp3 
        // let audioData = new Blob(dataArray,
        //   { 'type': 'audio/aif;' });
        let audioData = new Blob(dataArray);
        // After fill up the chunk  
        // array make it empty 
        dataArray = [];

        // Creating audio url with reference  
        // of created blob named 'audioData' 
        let audioSrc = window.URL
          .createObjectURL(audioData);

        // Pass the audio url to the 2nd video tag 
        playAudio.src = audioSrc;
      }
    })

    // If any error occurs then handles the error  
    .catch(function (err) {
      console.log(err.name, err.message);
    });

  return (
    <div className="App">
      {/* <div className="speak-box"> Speak here</div>
      <div className="speach-text-box">{speachText}</div> */}
      <header>
        <h1>Record and Play Audio in JavaScript</h1>
      </header>

      <p>
        <button id="btnStart">START RECORDING</button>

        <button id="btnStop">STOP RECORDING</button>
      </p>

      <audio controls muted='true' style={{ display: "none" }}></audio>

      <audio id="adioPlay" controls></audio>
      <p>{speachText}</p>
    </div>
  );
}

export default App;
