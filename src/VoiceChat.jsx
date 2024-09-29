import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BASE_URL);

const VoiceChat = () => {
  const [room, setRoom] = useState('');

  const audioRef = useRef(null);

  // const audioContext = new AudioContext();

  // const startAudioCapture = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

  //     // const audioContext = new AudioContext();
  //     const source = audioContext.createMediaStreamSource(stream);

  //     const processor = audioContext.createScriptProcessor(1024, 1, 1);


  //     source.connect(processor);
  //     processor.connect(audioContext.destination);

  //     processor.onaudioprocess = (event) => {
  //       const inputBuffer = event.inputBuffer;
  //       const inputData = inputBuffer.getChannelData(0);
  //       const audioData = new Float32Array(inputData);

  //       socket.emit('audio', {audioData, room});
  //     };

  //     audioRef.current = {
  //       processor,
  //       source,
  //       audioContext
  //     }

  //     return () => {
  //       processor.disconnect();
  //       source.disconnect();
  //       audioContext.close();
  //     };
  //   } catch(error) {
  //     console.error('Ошибка доступа к микрофону:', error);
  //   }
  // }


// --------------------------------------------------------- TEST

  const audioContext = new AudioContext();

  const startAudioCapture = () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        let audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", function (event) {
            audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", function () {
            const audioBlob = new Blob(audioChunks);
            audioChunks = [];
            const fileReader = new FileReader();
            fileReader.readAsDataURL(audioBlob);
            fileReader.onloadend = function () {
                let base64String = fileReader.result;
                socket.emit("audio", {audioData: base64String, room});
            };

            audioRef.current = {
              mediaRecorder
            };

            mediaRecorder.start();
            setTimeout(function () {
                mediaRecorder.stop();
            }, 1000);
        });

        mediaRecorder.start();
        setTimeout(function () {
            mediaRecorder.stop();
        }, 1000);
    })
    .catch((error) => {
        console.error('Error capturing audio.', error);
    });
  };

// ------------------------------------------------------------------



  useEffect(() => {
    return () => {
      if(audioRef.current) {
        // audioRef.current.processor.disconnect();
        // audioRef.current.source.disconnect();
        // audioRef.current.audioContext.close();

        audioRef.current.mediaRecorder.stop();
      }
    }
  }, [])

  // const handleAudio = (data) => {
  //   // console.log(data);
  //   const audioBuffer = new Float32Array(data);
  //   // const audioContext = new AudioContext();
  //   const buffer = audioContext.createBuffer(1, audioBuffer.length, audioContext.sampleRate);
  //   const channelData = buffer.getChannelData(0);
  //   channelData.set(audioBuffer);

  //   const source = audioContext.createBufferSource();
  //   source.buffer = buffer;
  //   source.connect(audioContext.destination);
  //   source.start();
  // };



const handleAudio =  (audioData) => {
    let newData = audioData.split(";");
    newData[0] = "data:audio/ogg;";
    newData = newData[0] + newData[1];

    let audio = new Audio(newData);
    if (!audio || document.hidden) {
        return;
    }
    audio.play();
};



  useEffect(() => {
      return () => {
        socket.off('audio', handleAudio);
      };
  }, [])

  const joinRoom = () => {
    socket.emit("joinRoom", room)

    startAudioCapture();

    socket.on('audio', handleAudio);
    // handleAudio()
  }

  const leaveRoom = () => {
    socket.emit("leaveRoom", room);
    setRoom("")
    // audioRef.current.processor.disconnect();
    // audioRef.current.source.disconnect();
    // audioRef.current.audioContext.close();

    audioRef.current.mediaRecorder.stop();
    socket.off('audio', handleAudio);
  }

  return (
    <div>
      <input
        value={room}
        placeholder="Room ID"
        onChange={e => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
      <button onClick={leaveRoom}>Leave Room</button>
      <p>Voice chat</p>
    </div>
  );
};

export default VoiceChat;