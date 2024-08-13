# Voice Notes Web App Test

Voice notes web application that utilizes real-time audio streaming and transcription. The task involves implementing a user-friendly interface where users can record their voice, view their live transcription, edit their transcription, and copy or clear it as needed.

![Example](example.gif)

## Task Details

### Implementation Checklist

- [ ] **Stream Audio:** Stream the recorded audio to the server for real-time transcription using WebSocket (Socket.IO) library.
- [ ] **Live Transcription:** Implement real-time transcription of the user's voice using Deepgram Transcription API.
- [ ] **Display Transcription:** Display the live transcription in a text area, allowing the user to see what they are saying in real-time.
- [ ] **Edit Transcription:** Allow the user to manually edit the transcription in the text area.
- [ ] **Copy Transcription:** Add a copy button that allows the user to easily copy the transcription to the clipboard.
- [ ] **Clear Transcription:** Add a clear button that resets the transcription and clears the text area.
- [ ] **Create Attractive UI:** Design and implement a visually appealing and intuitive user interface for the web app.

### Transcription API Integration

- The web app should integrate with Deepgram Transcription API to perform real-time transcription of the user's voice.
- The server-side implementation should handle the communication with the transcription API, including sending the audio stream and receiving transcription events.
- The client-side implementation should display the transcription events in real-time as they are received from the server.

### Audio Streaming with WebSocket (Socket.IO)

-  WebSocket (Socket.IO) library to establish a real-time bidirectional communication channel between the client and the server.
- Utilize the WebSocket connection to stream the recorded audio from the client to the server in real-time.
- Receive the audio stream on the server and forward it to the transcription API for real-time transcription.


## Setup

- Navigate to the client directory and run the following commands:
  ```
  cd client
  npm install
  npm run dev
  ```
- In a separate terminal window, navigate to the server directory and run the following commands:
  ```
  cd server
  npm install
  npm run dev
  ```

### Server-side Implementation

- Implement the server-side logic to handle the WebSocket connection and audio streaming.
- Use the Socket.IO library to establish a WebSocket connection between the client and the server.
- Receive the audio stream from the client via the WebSocket connection and send it to the transcription API for real-time transcription.
- Subscribe to the transcription events provided by the API and emit them to the client via the WebSocket connection.

### Client-side Implementation

-  `useAudioRecorder` file to handle audio recording events.
- Implement the client-side logic to establish a WebSocket connection with the server using the Socket.IO library.
- Stream the recorded audio to the server via the WebSocket connection in real-time.
- Listen for transcription events emitted by the server:
  - Display the interim transcription results in the text area as they are received, allowing the user to see the real-time transcription progress.
  - When the final transcription results are received, replace the interim results in the text area with the final transcription.
- Allow the user to manually edit the transcription in the text area.
- Implement a copy button that allows the user to easily copy the transcription to the clipboard.
- Add a clear button that resets the transcription and clears the text area.

