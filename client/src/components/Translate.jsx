import { useEffect, useState } from "react";
import useAudioRecorder from "./useAudioRecorder";
import useSocket from "./useSocket";


// @TOD0: Something wrong in my deepgram translation not translating.

function Translate() {
  const { initialize, disconnect, sendData } = useSocket();
  const [transcription, setTranscription] = useState("");
  const [transcriberReady, setTranscriberReady] = useState(false);

  const { startRecording, stopRecording, isRecording } = useAudioRecorder({
    dataCb: (data) => {
      console.log("incoming data") // Debugging
      if (transcriberReady) {
        sendData("incoming-audio", data);
      }
    },
  });


  useEffect(() => {
    const socket = initialize(); // Initialize the socket connection
  
    if (socket) {
      console.log('WebSocket initialized'); // Debugging statement
  
      socket.on("transcriber-ready", () => {
        console.log('Transcriber is ready'); // Debugging statement
        setTranscriberReady(true);
      });
  
      socket.on("partial", (data) => {
        console.log("Partial transcription received:", data); // Debugging statement
        setTranscription((prev) => prev + data); // Append partial transcription
      });
  
      socket.on("final", (data) => {
        console.log("Final transcription received:", data); // Debugging statement
        setTranscription((prev) => prev + "\n" + data); // Append final transcription
      });
  
      socket.on("error", (error) => {
        console.error("WebSocket error:", error); // Debugging statement
      });
    } else {
      console.error('WebSocket initialization failed'); // Debugging statement
    }
  
    return () => {
      disconnect(); // Cleanup on unmount
    };
  }, [initialize, disconnect]);


  const onStartRecordingPress = async () => {
    console.log("Start recording button clicked"); // Debugging statement
    setTranscription(""); // Clear previous transcription
    sendData("configure-stream", { sampleRate: 16000 });
    startRecording();
  };

  const onStopRecordingPress = () => {
    console.log("Stop recording button clicked"); // Debugging statement
    stopRecording();
    sendData("stop-stream");
  };

  const onCopyTranscription = () => {
    console.log("Copy text"); // Debugging statement
    navigator.clipboard.writeText(transcription);
  };

  const onClearTranscription = () => {
    setTranscription("");
  };

  return (
     <div className="container">
      <h1>Voice Notes</h1>
      <p>Record or type something in the textbox.</p>
      <button onClick={onStartRecordingPress} disabled={isRecording} id="record-button">
        Start Recording
      </button>
      <button onClick={onStopRecordingPress} disabled={!isRecording}>
        Stop Recording
      </button>
      <button onClick={onCopyTranscription} id="copy-button">
        Copy Transcription
      </button>
      <button onClick={onClearTranscription} id="reset-button">
        Clear Transcription
      </button>
      <textarea
        id="transcription-display"
        value={transcription}
        onChange={(e) => setTranscription(e.target.value)}
        rows="10"
        cols="50"
        placeholder="Transcription will appear here..."
      />
    </div>
  );
}

export default Translate;
