const yaml = require('js-yaml');
const fs   = require('fs');
 
function expandYaml(sourceYaml, targetYaml) {
  const doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
  const expanded = yaml.dump(doc, {noRefs: true});
}
