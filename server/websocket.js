import Transcriber from "./transcriber.js";

/**
 * Events to subscribe to:
 * - connection: Triggered when a client connects to the server.
 * - configure-stream: Requires an object with a 'sampleRate' property.
 * - incoming-audio: Requires audio data as the parameter.
 * - stop-stream: Triggered when the client requests to stop the transcription stream.
 * - disconnect: Triggered when a client disconnects from the server.
 *
 * Events to emit:
 * - transcriber-ready: Emitted when the transcriber is ready.
 * - final: Emits the final transcription result (string).
 * - partial: Emits the partial transcription result (string).
 * - error: Emitted when an error occurs.
 */

const initializeWebSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Connection established (${socket.id})`);

    let transcriber = null;

    // Event: configure-stream
    socket.on("configure-stream", ({ sampleRate }) => {
      console.log(`Configuring stream with sample rate: ${sampleRate}`);

      try {
        transcriber = new Transcriber(process.env.DEEPGRAM_API_KEY); // Pass the API key
        transcriber.startTranscriptionStream(sampleRate);

        // Listen for transcription events
        transcriber.on("transcriber-ready", () => {
          console.log("Transcriber is ready");
          socket.emit("transcriber-ready");
        });

        transcriber.on("final", (transcription) => {
          console.log("Final transcription:", transcription);
          socket.emit("final", transcription);
        });

        transcriber.on("partial", (transcription) => {
          console.log("Partial transcription:", transcription);
          socket.emit("partial", transcription);
        });

        transcriber.on("error", (error) => {
          console.error("Transcriber error:", error);
          socket.emit("error", error);
        });

      } catch (error) {
        socket.emit("error", "Failed to configure stream");
        console.error("Error configuring stream:", error);
      }
    });

    // Event: incoming-audio
    socket.on("incoming-audio", (audioData) => {
      console.log("Received audio data");

      if (transcriber) {
        try {
          transcriber.send(audioData);
          console.log("Audio data sent to transcriber");
        } catch (error) {
          socket.emit("error", "Failed to process audio");
          console.error("Error processing audio:", error);
        }
      } else {
        socket.emit("error", "Transcriber not initialized");
      }
    });

    // Event: stop-stream
    socket.on("stop-stream", () => {
      console.log("Stopping transcription stream");

      if (transcriber) {
        transcriber.endTranscriptionStream();
        transcriber = null; // Reset the transcriber
        console.log("Transcription stream stopped");
      } else {
        socket.emit("error", "No active transcription stream to stop");
      }
    });

    // Event: disconnect
    socket.on("disconnect", () => {
      console.log(`Connection closed (${socket.id})`);
      if (transcriber) {
        transcriber.endTranscriptionStream();
        transcriber = null;
      }
    });
  });

  return io;
};

export default initializeWebSocket;
