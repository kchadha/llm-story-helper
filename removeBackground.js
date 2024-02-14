/* eslint-disable require-jsdoc */
import {AutoModel, AutoProcessor, env, RawImage} from '@xenova/transformers';
import sharp from 'sharp';

import sampleImages from './sampleImages.js';

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
      
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
};

const rgbaArrayToBase64WebP = (rgbaArray, width, height) => {
    // Convert the RGBA array to a Buffer
    const buffer = Buffer.from(rgbaArray);
    
    console.log("Running Sharp");
    // Use sharp to convert the buffer to WebP and then to a Base64 string
    return sharp(buffer, {
      raw: {
        width: width,
        height: height,
        channels: 4 // RGBA has 4 channels
      }
    })
    .toFormat('webp')
    .toBuffer()
    .then(data => {
      // Convert to a Base64 string
      console.log('Converting to base64 string');
      const base64 = data.toString('base64');
      const base64Image = `data:image/webp;base64,${base64}`;
      // console.log(base64Image);
      return base64Image;
    })
    .catch(err => {
      console.error('Error converting image', err);
    });
};
  
  // Example usage
  // Make sure to replace 'width' and 'height' with the actual dimensions of your image
  // rgbaArrayToBase64WebP(rgbaArray, width, height);


export default (async imageStr => {
    console.log("Removing background... ");

    // Since we will download the model from the Hugging Face Hub, we can skip the local model check
    env.allowLocalModels = false;

    // Proxy the WASM backend to prevent the UI from freezing
    env.backends.onnx.wasm.proxy = true;

    const model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
    // Do not require config.json to be present in the repository
        config: {model_type: 'custom'}
    });

    const processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
    // Do not require config.json to be present in the repository
        config: {
            do_normalize: true,
            do_pad: false,
            do_rescale: true,
            do_resize: true,
            image_mean: [0.5, 0.5, 0.5],
            feature_extractor_type: 'ImageFeatureExtractor',
            image_std: [1, 1, 1],
            resample: 2,
            rescale_factor: 0.00392156862745098,
            size: {width: 1024, height: 1024}
        }
    });

    // Predict foreground of the given image
    const predict = async url => {
        // Read image
        const b64Data = url = url.replace('data:image/webp;base64,', '');
        const contentType = 'image/webp';
        
        console.log("B64 to Blob");
        const blob = b64toBlob(b64Data, contentType);
        
        console.log("Image from Blob");
        const image = await RawImage.fromBlob(blob);

        // Preprocess image
        // eslint-disable-next-line camelcase
        console.log("Pre-processing Image");
        const {pixel_values} = await processor(image);

        // Predict alpha matte
        console.log("Running the model");
        const {output} = await model({input: pixel_values});

        // Resize mask back to original size
        console.log("Resizing mask");
        const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height);

        console.log("Adding mask to image");
        const arr = image.convert(4).data;
        for (let i = 3; i < (image.height * image.width * image.channels); i+= 4 ) {
            arr[i] = mask.data[((i+1)/4) - 1];
        }

        console.log("RGBA Array to Base64 Webp");
        return rgbaArrayToBase64WebP(arr, image.width, image.height);
    };

    console.log("Predicting image");
    return predict(imageStr);
});
