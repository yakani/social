// services/nsfwDetection.js
import  tf from  '@tensorflow/tfjs';
import  nsfwjs from  'nsfwjs';

let model;

async function loadModel() {
  model = await nsfwjs.load();
}

async function classifyImage(file) {
  if (!model) await loadModel();
  
  const image = await tf.node.decodeImage(file, 3);
  const predictions = await model.classify(image);
  image.dispose();
  
  return predictions;
}

export {
  classifyImage,
  loadModel
};