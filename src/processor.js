class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];

        if (input.length > 0) {
            const inputData = input[0];
            // Отправка данных через порт
            this.port.postMessage({ audioData: inputData.slice() });
        }

        return true; // Вернуть true, чтобы продолжить процесс
    }
}

// class AudioProcessor extends AudioWorkletProcessor {
//     process(inputs, outputs, parameters) {
//         const input = inputs[0];
//         const output = outputs[0];

//         for (let channel = 0; channel < output.length; ++channel) {
//             const inputChannel = input[channel];
//             const outputChannel = output[channel];

//             for (let i = 0; i < inputChannel.length; i++) {
//                 // Пример обработки: просто копируем данные
//                 outputChannel[i] = inputChannel[i];
//             }
//         }

//         // Отправляем данные на клиент
//         this.port.postMessage({ audioData: input[0] });
//         return true;
//     }
// }


registerProcessor('audio-processor', AudioProcessor);


