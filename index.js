import OpenAI from 'openai';
import prompts from './prompts.js';
import Agent from './agentCreator.js'
import removeBackground from './removeBackground.js';
import express from 'express';
import https from 'https';
import http from 'http';
import cors from 'cors'
import fs from 'fs';

const delay = ms => new Promise(res => {
  console.log("Starting delay");
  return setTimeout(res, ms)
});

const openai = new OpenAI();

const agent = new Agent('Subject Diversifier', prompts.diversify8, /*req.query.prompt*/);
agent.setupAssistant();

// const server = certKeyPath ? restify.createServer({...options}) : restify.createServer();
// const server = certKeyPath ? express({...options}) : express();
const server = express();
server.use(cors());
server.use(express.json({limit: '1gb'}));

// if (certKeyPath) https.createServer(options);
// server.use(restify.plugins.queryParser());

// const cors = corsMiddleware({
//   preflightMaxAge: 5, //Optional
//   origins: ['*'],
//   allowHeaders: ['Origin',  'Accept',  'Accept-Version',  'Content-Length', 'Content-Type',  'Date',  'X-Requested-With', 'X-Response-Time', 'Authorization'], 
//   exposeHeaders: [],
//   // allowMethods: ['OPTIONS', 'DELETE', 'POST']
// })
 
// server.pre(cors.preflight)
// server.use(cors.actual)

// server.use(
//   function crossOrigin(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "OPTIONS, DELETE, POST, GET, PATCH, PUT");
//     res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
//     return next();
//   }
// );

const getImage = async (prompt, query) => {
  const size = query.wide ? '1792x1024' : '1024x1024';
  const p = `${query.promptPrefix || ''} ${prompt} ${query.promptSuffix || ''}`.trim();
  // console.log("Size: ", size);
  console.log('Prompt:', p, '\n');
  return openai.images.generate({
      model: "dall-e-3",
      prompt: `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: ${p}`,
      n: 1,
      size: size,
      response_format: 'b64_json'
  })
  .then(resp => {
    console.log("Got generated image");
    // return `data:image/webp;base64,${resp.data[0].b64_json}`;
    return resp.data[0];
  })
  .catch(error => {
      console.log("Error generating image");
      if (error.code === 'content_policy_violation') {
        // Retry
        console.log('Content policy violation, returning invalid image. Broken Prompt:\n', p);
        return {b64_json: '', revised_prompt: 'content policy violation'};
      } else if (error.code === 'rate_limit_exceeded') {
        // Retry
        console.log('Rate Limit Exceeded, trying again.');
        return delay(30000).then(() => getImage(prompt, query));
      }
      console.log("Prompt: ", p, "\n Error: ", error, error.response);
      return {b64_json: '', revised_prompt: 'invalid image'};
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
      images.push(`data:image/webp;base64,${imageResp.b64_json}`);
      dalleRevisedPrompts.push(imageResp.revised_prompt);
    })
    res.contentType = 'json';
    res.send({images, dalleRevisedPrompts});
    return next();
  });
});

server.get('/prompt_variants', function(req, res, next){
  if (!req.query.prompt) {
    console.log("Ping /prompt_variants");
    res.end();
    return next();
  }

  console.log("GET /prompt_variants");

  // const agent = new Agent('Subject Diversifier', prompts.diversify7, /*msgObj.subjects*/ req.query.prompt);
  // const setup = agent.initialize();
  
  (async () => {
    const threadId = req.query.threadId || await agent.initializeThread();

    const runId = await agent.newPrompt(threadId, req.query.prompt);
    
    agent.loopStep(threadId, runId)
    .then((v, rejected) => {

      if (rejected) { // Got an error, chatGPT did not give JSON, fail gracefully
        res.contentType = 'json';
        const responseObj = {
          prompts: [req.query.prompt, req.query.prompt, req.query.prompt, req.query.prompt],
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
    // const image = JSON.parse(req.body).image;
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

    console.log("GET /");

    const plainPromptImages = [];
    const start = Date.now();
    for (let i = 0; i < 4; i++) {
      getImage(req.query.prompt, req.query)
      .then(i => plainPromptImages.push(i));
    }

    (async () => {
      const threadId = req.query.threadId || await agent.initializeThread();

      const runId = await agent.newPrompt(threadId, req.query.prompt);
    
      try {
        return agent.loopStep(threadId, runId)
        .then(async (v) => {
          const end = Date.now();
          const timeElapsed = end - start;

          const timeDelay = 60000 - timeElapsed;
          console.log("Adding time delay of ", timeDelay);

          await new Promise((r) => setTimeout(r, timeDelay));
          return v;
        })
        .then(v => v.variants)
        .then(imagePrompts => Promise.all(imagePrompts.map(async prompt => {
            
            return getImage(prompt, req.query);
          }))
          .then(images => {
            console.log("Got images!");
            res.contentType = 'json';
            const responseObj = {prompts: imagePrompts, images, plainPromptImages, threadId};
            // console.log("Response Obj: ", responseObj);

            console.log("Sending response");

            res.send(responseObj);
            return next();
          })
          .catch(e => {
            console.log("Got an error in the image gen process... ", e);
          })
        );
      } catch (e) {
        console.log("Got an error somewhere in the request handling process: ", e);
      }
    })();
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