
import './App.css'
import VoiceChat from './VoiceChat'
import { Route, Routes, useNavigate } from 'react-router-dom'

function App() {

  return (
    <>
      {/* <Routes>
          <Route path='/' element={
            <ConnectForm connectToVideo={ handleConnect } />
            }
          />
          <Route path='/via/:channelName' element={
            <AgoraRTCProvider client={agoraClient}>
              <LiveVideo />
            </AgoraRTCProvider>} />
      </Routes> */}
      <VoiceChat/>
    </>
  )
}

export default App
