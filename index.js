import OpenAI from 'openai';
import prompts from './prompts.js';
import Agent from './agentCreator.js'
import removeBackground from './removeBackground.js';
import restify from 'restify';

const openai = new OpenAI();

const certKeyPath = process.env.CERT_KEY_PATH || '';
const certPath = process.env.CERT_PATH || '';

const options = {
  key: certKeyPath && fs.readFileSync(certKeyPath),
  cert: certPath && fs.readFileSync(certPath)
};

const server = restify.createServer(certKeyPath && {...options});
server.use(restify.plugins.queryParser());

server.use(
  function crossOrigin(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "OPTIONS, DELETE, POST, GET, PATCH, PUT");
    return next();
  }
);

const getImage = async (prompt, query) => {
  const size = query.wide ? '1792x1024' : '1024x1024';
  const p = `${query.promptPrefix || ''} ${prompt} ${query.promptSuffix || ''}`.trim();
  // console.log("Size: ", size);
  console.log('Prompt', p);
  return openai.images.generate({
      model: "dall-e-3",
      prompt: p,
      n: 1,
      size: size,
      // size: '512x512',
      // size: '256x256',
      response_format: 'b64_json'
  })
  .then(resp => {
    console.log("Got generated image");
    return `data:image/webp;base64,${resp.data[0].b64_json}`;
  })
  .catch(error => {
      console.log("Got an error generating image with prompt: ", p, "\n Error: ", error, error.response);
      return '';
  });
};

// .then(response => {
//   return removeBackground(response.data[0].b64_json);
// })



server.get('/images', function(req, res, next) {
  console.log("Got a GET /images");
  if (!req.query.prompt) {
    res.end();
    return next();
  }
  getImage(req.query.prompt, req.query).then(image => {
    res.contentType = 'json';
    res.send(image);
    return next();
  });
});

// server.get('/removebg', function(req, res, next) {
//   console.log('GET /removebg');
//   if (!req.body.image) {
//     res.end();
//     return next();
//   }
//   (async () => {
//     await removeBackground(req.body.image).then(newImg => {
//       res.contentType = 'json';
//       res.send(newImg);
//       return next();
//     });
//   })();
// });

server.get('/', function(req, res, next) {
    console.log("GET /");
    if (!req.query.prompt) {
      res.end();
      return next();
    }

    const agent = new Agent('Subject Diversifier', prompts.diversify7, /*msgObj.subjects*/ req.query.prompt);
    const setup = agent.initialize();
    
    const plainPromptImages = [];
    const start = Date.now();
    for (let i = 0; i < 4; i++) {
      getImage(req.query.prompt, req.query)
      .then(new Promise(r => setTimeout(r, 15000)))
      .then(i => plainPromptImages.push(i));
    }

    
    try {
      return setup
      .then(() => agent.stepPromise)
      .then(v => v.variants)
      .then(imagePrompts => Promise.all(imagePrompts.map(async prompt => {
          const end = Date.now();
          const timeElapsed = end - start;

          const timeDelay = 60000 - timeElapsed;
          console.log("Adding time delay of ", timeDelay);

          await new Promise(r => setTimeout(r, timeDelay));
          
          return getImage(prompt, req.query);
            // .then(removeBackground)
            // .catch(e => {
            //   console.log("Error removing background: ", e);
            //   return '';
            // });
            // .then(i => {
            //   debugger;
            //   return removeBackground(i);
            // });
        }))
        .then(images => {
          console.log("Got images!");
          res.contentType = 'json';
          const responseObj = {prompts: imagePrompts, images, plainPromptImages};
          // console.log("Response Obj: ", responseObj);

          console.log("Sending response");

          res.send(responseObj);
          return next();
        })
      );
    } catch (e) {
      console.log("Got an error somewhere in the process: ", e);
    }
});

var port = process.env.PORT || 8033;
server.listen(port, function() {
  console.log('Server listening on port ' + port);
});