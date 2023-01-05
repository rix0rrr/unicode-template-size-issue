import { pipelines, Stack, StackProps } from "aws-cdk-lib";
import { Asset } from "aws-cdk-lib/aws-s3-assets";
import { Construct } from "constructs";
import { UnicodeTemplateSizeIssueStage } from "./unicode-template-size-issue-stack";

export class UnicodeTemplateSizeIssuePipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // Upload the current source directory to S3 and make the pipeline deploy it
    const currentSource = new Asset(this, 'CurrentSourceDir', {
      path: '.',
      exclude: [
        'cdk.out',
        'node_modules',
      ],
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Build', {
        input: pipelines.CodePipelineSource.s3(currentSource.bucket, currentSource.s3ObjectKey),
        commands: [
          'npm ci',
          'npx cdk synth',
        ],
      }),

      selfMutation: false,
    });

    // Works
    pipeline.addStage(new UnicodeTemplateSizeIssueStage(this, 'Small-Unicode', {
      ruleCount: 2,
      hasUnicodeChar: true,
    }));
    // Works
    pipeline.addStage(new UnicodeTemplateSizeIssueStage(this, 'Big', {
      ruleCount: 20,
      hasUnicodeChar: false,
    }));
    // Fails
    pipeline.addStage(new UnicodeTemplateSizeIssueStage(this, 'Big-Unicode', {
      ruleCount: 20,
      hasUnicodeChar: true,
    }));
  }
}