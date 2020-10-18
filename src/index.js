const { program } = require('commander');
const yaml = require('js-yaml');
const fs   = require('fs');
const sgf = require("staged-git-files");
const util = require('util');
const simpleGit = require('simple-git');
const git = simpleGit();
const getStagedFiles = util.promisify(sgf);

async function expandYaml(sourceYaml, targetYaml) {
  const doc = yaml.safeLoad(fs.readFileSync(sourceYaml, 'utf8'));
  const expanded = yaml.dump(doc, {noRefs: true});
  fs.writeFileSync(targetYaml, expanded, "utf8");
}

async function execute(arg) {
  const stagedFiles = await getStagedFiles();
  const isSourceFileStaged = stagedFiles.some(f => f.filename === arg.sourceFile);
  if (isSourceFileStaged) {
    expandYaml(arg.sourceFile, arg.targetFile);
    if (arg.addTargetGit) {
      gitAdd(arg.targetFile);
    }
  } 
}

function gitAdd(targetFile) {
  git.add(targetFile);
}

program
  .requiredOption("-s, --sourceFile <source>")
  .requiredOption("-t, --targetFile <target>")
  .option("-a, --add-target-git");
execute(program.parse(process.argv));