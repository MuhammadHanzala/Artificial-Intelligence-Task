const fs = require('fs');
const Speech = require('@google-cloud/speech');

const speech = Speech();

const LanguageServiceClient = require('@google-cloud/language')
    .LanguageServiceClient;

const language = new LanguageServiceClient();

const filename = 'Ja-Osaka_and_En-Osaka.wav';

const encoding = 'LINEAR16';

const sampleRateHertz = 16000;

const languageCode = 'en-US';

const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode
};
const audio = {
    content: fs.readFileSync(filename).toString('base64')
    // uri: 'https://firebasestorage.googleapis.com/v0/b/bloodbank-876e1.appspot.com/o/posts%2Fnasir?alt=media&token=80477f75-a2d4-4f5b-94f0-e37da96bf9a4'
};

const request = {
    config: config,
    audio: audio
};


speech.recognize(request)
    .then((data) => {
        const response = data[0];
        const transcription = response.results.map(result =>
            result.alternatives[0].transcript).join('\n');
        console.log(`Transcription: `, transcription);


        const document = {
            content: transcription,
            type: 'PLAIN_TEXT',
        };

        // Detects the sentiment of the text
        language
            .analyzeSentiment({ document: document })
            .then(results => {
                const sentiment = results[0].documentSentiment;
                console.log(`Document sentiment:`);
                console.log(`  Score: ${sentiment.score}`);
                console.log(`  Magnitude: ${sentiment.magnitude}`);

                const sentences = results[0].sentences;
                sentences.forEach(sentence => {
                    console.log(`Sentence: ${sentence.text.content}`);
                    console.log(`  Score: ${sentence.sentiment.score}`);
                    console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
                });
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    })
    .catch((err) => {
        console.error('ERROR:', err);
    });

