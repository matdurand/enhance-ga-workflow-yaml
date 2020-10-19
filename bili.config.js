import { Config } from "bili";

const config = {
  input: "src/index.js",
  babel: {
    minimal: true
  },
  output: {
    fileName: "index.js",
    format: ["cjs"],
    moduleName: "enhance-ga-workflow-yaml"
  }
};

export default config;
