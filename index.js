import OpenAI from 'openai';
import prompts from './prompts.js';
import Agent from './agentCreator.js'
import removeBackground from './removeBackground.js';
import express from 'express';
import https from 'https';
import http from 'http';
import cors from 'cors'
import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, updateMetadata, uploadString } from "firebase/storage";
import uid from './uid.js';

// import sampleImages from './sampleImages.js';
// const sampleImage = sampleImages[0];


const systemPromptKey = 'diversify10';
const systemPrompt = prompts[systemPromptKey];

const firebaseAPIKey = process.env.FIREBASE_API_KEY || '';
const firebaseAuthDomain = process.env.FIREBASE_AUTH_DOMAIN || '';
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || '';
const firebaseStorageBucket = process.env.FIREBASE_STORAGE_BUCKET || '';
const firebaseMessagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID || '';
const firebaseAppId = process.env.FIREBASE_APP_ID || '';

const firebaseConfig = {
  apiKey: firebaseAPIKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId
};

const app = initializeApp(firebaseConfig);
const storage = getStorage();
const genImagesRef = ref(storage, 'generatedImages');

// Data URL string
const storeImageData = function(imageObject){
  const imageURL = imageObject.imageURL;
  const objectName = uid();

  const newRef = ref(genImagesRef, `${objectName}.webp`);

  const metadata = {
    contentType: 'image/webp',
    customMetadata: {
      originalPrompt: imageObject.originalPrompt,
      dalleRevisedPrompt: imageObject.dalleRevisedPrompt,
      gptRewrittenPrompt: imageObject.gptRewrittenPrompt,
      systemPromptKey,
      systemPrompt
    }
  };

  console.log("Storing image");
  return uploadString(newRef, imageURL, 'base64', metadata);
}

const delay = ms => new Promise(res => {
  console.log("Starting delay");
  return setTimeout(res, ms)
});

const openai = new OpenAI();

const diversifierAgent = new Agent('Subject Diversifier', systemPrompt, /*req.query.prompt*/);
diversifierAgent.setupAssistant();

const keywordsAgent = new Agent('Keywords Generator', prompts.keywords);
keywordsAgent.setupAssistant();

const server = express();
server.use(cors());
server.use(express.json({limit: '1gb'}));

const describeImage = async (imageURL, prompt) => {
  console.log("Making gpt-vision request");
  console.log("Image URL: ", imageURL.slice(0, 10));
  const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `${prompts.describeImage}\nDescription: ${prompt}` },
            {
              type: "image_url",
              image_url: {
                "url": imageURL
              },
            },
          ],
        },
      ],
      max_tokens: 1500
  });

  console.log("Vision response: ", response);

  return response.choices[0].message.content;
}

const PROMPT_PREFIX = 'A digital illustration of ';
const PROMPT_SUFFIX = ' Full length image. On a white background. Appropriate for children.';

const getImage = async (prompt, query) => {
  const size = query.wide ? '1792x1024' : '1024x1024';
  const p = `${query.promptPrefix || ''} ${prompt} ${query.promptSuffix || ''}`.trim();
  // console.log("Size: ", size);
  console.log('Prompt:', p, '\n');

  const originalPrompt = query.originalPrompt || prompt;
  let revisedPrompt = '';

  return openai.images.generate({
      model: "dall-e-3",
      prompt: `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: ${p}`,
      n: 1,
      size: size,
      response_format: 'b64_json'
  })
  .then(resp => {
    console.log("Got generated image");

    const b64JSON = resp.data[0].b64_json;
    const imageURL = `data:image/webp;base64,${b64JSON}`
    revisedPrompt = resp.data[0].revised_prompt;

    // return `data:image/webp;base64,${resp.data[0].b64_json}`;
    const imageObject = {
      // imageURL: sampleImage.split(',')[1],
      // dalleRevisedPrompt: 'test image',
      
      imageURL: b64JSON,
      // webURL: resp.data[0].url,
      originalPrompt,
      dalleRevisedPrompt: revisedPrompt,
      
      gptRewrittenPrompt: query.originalPrompt ? prompt : ''
    }
    storeImageData(imageObject);
    return { imageURL, revisedPrompt };
  })
  .catch(error => {
      console.log("Error generating image");
      if (error.code === 'content_policy_violation') {
        // Retry
        console.log('Content policy violation, returning invalid image. Broken Prompt:\n', p);
        return {imageURL: '', error: 'content policy violation', revisedPrompt: (revisedPrompt || originalPrompt)};
      } else if (error.code === 'rate_limit_exceeded') {
        // Retry
        console.log('Rate Limit Exceeded, trying again.');
        return delay(30000).then(() => getImage(prompt, query));
      }
      console.log("Prompt: ", p, "\n Error: ", error, error.response);
      return {imageURL: '', error: 'invalid  image', revisedPrompt: (revisedPrompt || originalPrompt)};
  });
};

server.get('/images', function(req, res, next) {
  if (!req.query.prompt) {
    console.log('Ping /images');
    res.end();
    return next();
  }

  console.log("Got a GET /images");

  const imagePromises = [];
  for (let i = 0; i < (Number(req.query.num) || 1); i++) {
      imagePromises.push(
        getImage(req.query.prompt, req.query)
      );
  }

  Promise.all(imagePromises).then(imageResps => {
    const images = [];
    const dalleRevisedPrompts = [];
    imageResps.forEach(imageResp => {
      images.push(imageResp.imageURL);
      dalleRevisedPrompts.push(imageResp.revisedPrompt);
    })
    res.contentType = 'json';
    res.send({images, dalleRevisedPrompts /* , webURLs*/});
    return next();
  });
});

server.post('/image_variant', function(req, res, next){
  console.log('Ping /image_variant');
  
  if (!req.body) {
    console.log('No req body found');
    res.end();
    return next();
  }
  console.log("Got a POST /image_variant");

  (async () => {
    const imageURL = req.body.imageURL;
    const prompt = req.body.prompt || '';
    const wide = req.body.wide || false;
    describeImage(imageURL, prompt)
    .then(responseText => {
      console.log("Response text: ", responseText);
      return getImage(responseText, {wide, promptPrefix: PROMPT_PREFIX, promptSuffix: PROMPT_SUFFIX})
        .then(imageResp => {
          res.contentType = 'json';
          res.send({
            imageURL: imageResp.imageURL,
            originalPrompt: responseText,
            revisedPrompt: imageResp.revisedPrompt
          });
          return next();
        })
    })
  })();
});

server.get('/keywords', function(req, res, next){
  if (!req.query.prompt) {
    console.log("Ping /keywords");
    res.end();
    return next();
  }

  console.log('GET /keywords');
  console.log("Prompt: ", req.query.prompt);

  (async () => {
    const threadId = req.query.threadId || await keywordsAgent.initializeThread();
    const runId = await keywordsAgent.newPrompt(threadId, req.query.prompt);

    keywordsAgent.loopStep(threadId, runId)
    .then((k, rejected) => {
      if (rejected) {// Got an error, chatGPT did not give JSON, fail gracefully
        res.contentType = 'json';
        const responseObj = {
          keywords: [],
          threadId
        };
        res.send(responseObj);
        return next();
      }

      res.contentType = 'json';
      console.log("V: ", k);
      const responseObj = {keywords: k.keywords, threadId};
      
      console.log("Sending response");

      res.send(responseObj);
      return next();
    });

  })();

});

server.get('/prompt_variants', function(req, res, next){
  if (!req.query.prompt) {
    console.log("Ping /prompt_variants");
    console.log("Query: ", req.query);
    res.end();
    return next();
  }

  console.log("GET /prompt_variants");

  
  (async () => {
    const threadId = req.query.threadId || await diversifierAgent.initializeThread();

    const p = `${req.query.promptPrefix || ''} ${req.query.prompt} ${req.query.promptSuffix || ''}`.trim();

    const runId = await diversifierAgent.newPrompt(threadId, p);
    
    diversifierAgent.loopStep(threadId, runId)
    .then((v, rejected) => {

      if (rejected) { // Got an error, chatGPT did not give JSON, fail gracefully
        res.contentType = 'json';
        const responseObj = {
          prompts: [p,p,p,p],
          threadId
        };
        res.send(responseObj);
        return next();
      }

      res.contentType = 'json';
      console.log("V: ", v);
      const responseObj = {prompts: v.variants, threadId};
      
      console.log("Sending response");

      res.send(responseObj);
      return next();
    });
  })();
});

const removeBg = function (method, req, res, next) {
  console.log('Ping /removebg');
  
  if (!req.body) {
    console.log('No req body found');
    res.end();
    return next();
  }
  
  console.log(`${method} /removebg`);
  
  (async () => {
    const image = req.body.image.split(',')[1];
    removeBackground(image).then(newImg => {
      res.contentType = 'json';
      res.send({image: newImg});
      return next();
    });
  })();
}

server.post('/removebg', (req, res, next) => removeBg('POST', req, res, next));
server.put('/removebg', (req, res, next) => removeBg('PUT', req, res, next));

server.get('/', function(req, res, next) {
    if (!req.query.prompt) {
      console.log("Ping /");
      res.end();
      return next();
    }
});

const port = process.env.PORT || 8033;

const certKeyPath = process.env.CERT_KEY_PATH || '';
const certPath = process.env.CERT_PATH || '';

const options = {
  key: certKeyPath && fs.readFileSync(certKeyPath),
  cert: certPath && fs.readFileSync(certPath)
};

if (certKeyPath) {
  https.createServer(options, server).listen(port, function () {
    console.log('Server listening on port ' + port);
  });
} else {
  http.createServer(options, server).listen(port, function () {
    console.log('Server listening on port ' + port);
  });
}