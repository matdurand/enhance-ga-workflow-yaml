# expand-staged-yaml

This CLI utility is used to expand a source yaml file using anchors, aliases or merge feature of yaml into a plain yaml
file. 

Tools like Github Actions are not accepting yaml files with advanced features, like anchors or aliases. To mitigate 
that, we can plug this cli tool into a pre-commit hook. If the source file is changed, the target file will be generated
with a expanded version of the original file, making it compatible with any yaml processor.

## Running it

Just execute
```
expand-staged-yaml -s my-yaml-file.yaml -t my-plain-expanded-yaml-file.yaml
```

The target file is only generated if the source file is staged in git. You can add the `-a` option to staged the 
expanded file, in case you plug this tool in a pre-commit hook.