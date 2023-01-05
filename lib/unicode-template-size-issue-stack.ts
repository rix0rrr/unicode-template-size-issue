import * as cdk from 'aws-cdk-lib';
import { Rule } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface UnicodeTemplateSizeIssueStackProps extends cdk.StackProps {
  readonly ruleCount: number;
  readonly hasUnicodeChar: boolean;
}

/**
 * The job of this stack is to contain a variable number of event rules,
 * to demonstrate issues around stack size
 */
export class UnicodeTemplateSizeIssueStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: UnicodeTemplateSizeIssueStackProps) {
    super(scope, id, props);

    for (let i = 0; i < props.ruleCount; i++) {
      new Rule(this, `Rule${i}`, {
        // Max 512 chars, fill it up.
        // Add a single cyrillic letter upon request.
        description: 'a'.repeat(500) + (props.hasUnicodeChar ? 'Д' : ''),
        enabled: false,
        // Some bogus pattern to bulk the template size up a bit more (this can be up to 2048 bytes)
        eventPattern: {
          account: ['a'.repeat(500)],
          detail: {
            a: ['a'.repeat(500)],
            b: ['b'.repeat(500)],
            c: ['c'.repeat(400)],
          },
        },
      });
    }
  }
}

export class UnicodeTemplateSizeIssueStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: UnicodeTemplateSizeIssueStackProps) {
    super(scope, id);
    new UnicodeTemplateSizeIssueStack(this, 'Stack', props);
  }
}