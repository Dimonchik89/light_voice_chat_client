import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BASE_URL);

const VoiceChat = () => {
  const [room, setRoom] = useState('');

  const audioRef = useRef(null);


  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);

      // const processor = audioContext.createScriptProcessor(2048, 1, 1);

      // -----------------------


      await audioContext.audioWorklet.addModule('./processor.js');

      const processor = new AudioWorkletNode(audioContext, 'audio-processor');

      processor.port.onmessage = (event) => {
        const { audioData } = event.data;
        socket.emit('audio', { audioData, room });
      };

      source.connect(processor);
      processor.connect(audioContext.destination);


      // -------------------------

      // source.connect(processor);
      // processor.connect(audioContext.destination);

      // processor.onaudioprocess = (event) => {
      //   const inputBuffer = event.inputBuffer;
      //   const inputData = inputBuffer.getChannelData(0);

      //   const audioData = new Float32Array(inputData);
      //   socket.emit('audio', {audioData, room});
      // };

      audioRef.current = {
        processor,
        source,
        audioContext
      }

      return () => {
        processor.disconnect();
        source.disconnect();
        audioContext.close();
      };
    } catch(error) {
      console.error('Ошибка доступа к микрофону:', error);
    }
  }

  useEffect(() => {
    return () => {
      if(audioRef.current) {
        audioRef.current.processor.disconnect();
        audioRef.current.source.disconnect();
        audioRef.current.audioContext.close();
      }
    }
  }, [])

    const handleAudio = (data) => {
      const audioBuffer = new Float32Array(data);
      const audioContext = new AudioContext();
      const buffer = audioContext.createBuffer(1, audioBuffer.length, audioContext.sampleRate);
      const channelData = buffer.getChannelData(0);
      channelData.set(audioBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
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
  }

  const leaveRoom = () => {
    socket.emit("leaveRoom", room);
    setRoom("")
    .current.processor.disconnect();
    audioRef.current.source.disconnect();
    audioRef.current.audioContext.close();
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