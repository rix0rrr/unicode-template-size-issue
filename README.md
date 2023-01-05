# CodePipeline: Unicode Template Size repro

This repository demonstrates an issue around a deserialization
problem the interaction the CodePipeline CloudFormation Action
experiences when given templates of a certain size that contain
unicode characters.

## How to run

Configure AWS credentials in your current shell, then run:

```shell
npm ci
npx cdk deploy
```

Go to the CodePipeline console and observe the failures.

The relevant templates can be found and compared by running:

```shell
ls -al cdk.out/*/*.template.json
```
