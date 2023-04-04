const tf = require("@tensorflow/tfjs-node");
const tfnlp = require("@tensorflow-models/universal-sentence-encoder");

let encoder = null;
export async function loadModel() {
  encoder = await tfnlp.load();
}

export { encoder };
