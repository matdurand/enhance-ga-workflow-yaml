import { Config } from "bili";

const config = {
  input: "src/index.js",
  babel: {
    minimal: true
  },
  output: {
    fileName: "index.js",
    format: ["cjs"],
    moduleName: "expand-staged-yaml"
  }
};

export default config;
