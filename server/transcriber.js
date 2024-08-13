import { EventEmitter } from "events";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

class Transcriber extends EventEmitter {
  constructor(apiKey) {
    super();
    this.deepgram = createClient(apiKey); // Initialize Deepgram client with API key
    this.dgConnection = null; // Will hold the live transcription connection
  }

  /**
   * Starts the live transcription stream with the given sample rate.
   */
  startTranscriptionStream(sampleRate) {
    try {
      this.dgConnection = this.deepgram.listen.live({
        model: "nova",
        punctuate: true,
        language: "en",
        interim_results: true,
        smart_format: true,
        sample_rate: sampleRate,
      });

      console.log("Deepgram connection initialized:", this.dgConnection);

      if (!this.dgConnection) {
        throw new Error("Failed to create Deepgram connection");
      }


      this.dgConnection.on(LiveTranscriptionEvents.Open, () => {
        console.log("Deepgram connection opened");
        
      // @TODO: This piece of code is not working ???


        // Ensure you set up the event listener here
        this.dgConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
          console.log("Transcript data received:", data);
          const isFinal = data?.is_final;
          const text = data?.channel?.alternatives?.[0]?.transcript;
          if (text === undefined) {
            console.error("Transcript data missing expected properties");
            return;
          }

          if (isFinal) {
            this.emit("final", text);
          } else {
            this.emit("partial", text);
          }
        });

        this.emit("transcriber-ready");
      });

      this.dgConnection.on(LiveTranscriptionEvents.Error, (error) => {
        console.error("Deepgram connection error:", error);
        this.emit("error", error.message);
      });

      this.dgConnection.on(LiveTranscriptionEvents.Close, () => {
        this.emit("error", "Deepgram connection closed unexpectedly");
      });
    } catch (error) {
      console.error("Error starting transcription stream:", error);
      this.emit("error", "Failed to start transcription stream");
    }
  }
  /**
   * Sends audio payload to the transcription stream.
   */
  send(payload) {
    if (!this.dgConnection) {
      this.emit("error", "Transcription stream is not ready");
      return;
    }

    try {
      this.dgConnection.send(payload);
    } catch (error) {
      this.emit("error", "Failed to send audio data");
      console.error("Error sending audio data:", error);
    }
  }

  /**
   * Ends the transcription stream and closes the connection.
   */
  endTranscriptionStream() {
    if (this.dgConnection) {
      this.dgConnection = null; // Clear the connection
      this.emit("transcription-ended");
    } else {
      this.emit("error", "Transcription stream is not active");
    }
  }
}

export default Transcriber;
