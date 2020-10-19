# enhance-ga-workflow-yaml

As of today (October 2020), Github Actions workflow yamls don't support reusable yaml features such as anchors and aliases, or anything that would allow to reuse yaml definitions, like for example [CircleCI Orbs](https://circleci.com/orbs/).

To workaround this issue, you can use this library. The goal is to generate a plain yaml file for github to consume from another yaml file not read by github, where we can use enhanced features for code reuse.

## How-to
The best workflow to make this work is this:
* in your `.github` folder, create the standard `workflows` folder, and another folder called `enhanced-workflows`
* create your enhanced workflows in the `enhanced-workflows` folder (see below)
* install Husky in your project (or configure a git pre-commit hook if you are not using NPM)
* configure a pre-commit hook to run the enhance-ga-workflow-yaml cli utility for each of your workflow
* the utility will update the matching workflow in the `.github/workflows` folder when the matching workflow is staged in git in `enhanced-workflows`.


## Enhanced workflow
You can use standard yaml anchors and aliases in the enhanced workflow, however, there is a catch. Github will validate your workflows and will reject them if they contain sections not supported by github. This prevent us from addition a generic section not part of the github actions syntax to create reusable content, because this content will stay in the generated yaml and will be rejected.

To work around this, this cli utility supports the [`yaml-import`](https://www.npmjs.com/package/yaml-import) package, so you can include yaml import statements that will be expanded in the target file.


## Running it

Just execute, with `-s` matching the enhanced workflow and `-t` matching the generated workflow in the `.github/workflows` folder.
```bash
enhance-ga-workflow-yaml -s my-yaml-file.yaml -t my-plain-expanded-yaml-file.yaml -a
```

Note that the target file is generated only if the source file is currently staged in the git staging area. To see what the CLI is doing, add the `-v` option to get the verbose output.

## Examples

Let's create a snippet that we want to reuse:

```yaml
#.github/enhanced-workflows/cache-step.yaml
name: Cache NPM dependencies
uses: actions/cache@v1
with:
  path: ~/.npm
  key: ${{ runner.OS }}-npm-cache-${{ hashFiles('**/package-lock.json') }}
  restore-keys: |
    ${{ runner.OS }}-npm-cache-
```

and then a enhanced workflow
```yaml
#.github/enhanced-workflows/test.yaml
name: test
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - !!import/single cache-step.yaml
    - name: Install NPM dependencies
      run: npm install
```

Using the yaml-import package syntax, we can import the `cache-step.yaml` file and the generated output will contain
the expanded version with everything in a single file:
```yaml
#.github/workflows/test.yaml
name: test
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Cache NPM dependencies
        uses: actions/cache@v1
        with:
          path: ~/.npm
          key: '${{ runner.OS }}-npm-cache-${{ hashFiles(''**/package-lock.json'') }}'
          restore-keys: |
            ${{ runner.OS }}-npm-cache-
      - name: Install NPM dependencies
        run: npm install

```

To steamline this, you can use Husky to define a pre-commit hook:
`package.json`:
```json
{
  ...
  "scripts": {
    "update-ga-workflows": "enhance-ga-workflow-yaml -s .github/enhanced-workflows/test.yaml -t .github/workflows/test.yaml -a",
  },
  ...
  "husky": {
    "hooks": {
      "pre-commit": "npm run update-ga-workflows"
    }
  }
}

```