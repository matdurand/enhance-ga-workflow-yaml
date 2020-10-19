const { program } = require('commander');
const yaml = require('js-yaml');
const { read } = require('yaml-import');
const fs   = require('fs');
const path = require('path');
const sgf = require("staged-git-files");
const util = require('util');
const simpleGit = require('simple-git');
const git = simpleGit();
const getStagedFiles = util.promisify(sgf);

async function expandYaml(sourceYaml, targetYaml) {
  const doc = read(sourceYaml);
  const expanded = yaml.dump(doc, {noRefs: true});
  const generatedHeader = `## THIS FILE HAS BEEN GENERATED FROM ${sourceYaml}\n\n`;
  fs.writeFileSync(targetYaml, generatedHeader + expanded, "utf8");
}

async function execute(arg) {
  const stagedFiles = await getStagedFiles();
  const isSourceFileStaged = stagedFiles.some(f => f.filename === arg.sourceFile);
  if (isSourceFileStaged) {
    await expandYaml(arg.sourceFile, arg.targetFile);
    console.log(`${arg.targetFile} has been generated from ${arg.sourceFile}`);

    gitAdd(arg.targetFile);
    if (arg.verbose) {
      console.log(`${arg.targetFile} has been staged in git`);
    }
  } else {
    if (arg.verbose) {
      console.log(`ignoring ${arg.sourceFile} because it's not staged`);
    }
  }
}

function gitAdd(targetFile) {
  git.add(targetFile);
}

program
  .requiredOption("-s, --sourceFile <source>")
  .requiredOption("-t, --targetFile <target>")
  .option("-v, --verbose");
execute(program.parse(process.argv));