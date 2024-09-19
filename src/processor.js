class AudioProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
        console.log("input");

    const input = inputs[0];
    const output = outputs[0];


    if (input.length > 0) {
      const inputData = input[0];

      this.port.postMessage({ audioData: inputData.slice() });
    }

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);