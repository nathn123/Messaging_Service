import type { AWS } from '@serverless/typescript';

import queueHandler from '@functions/queueHandler';

const serverlessConfiguration: AWS = {
  service: 'messageservice',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', 'serverless-apigateway-service-proxy'],
  provider: {
    name: 'aws',
    region: 'eu-west-2',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  resources: {
    Resources: {
      MessageReceiverTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          Subscription: [{
            Protocol: 'SQS',
            Endpoint: {'Fn::GetAtt' : ['MessageReceiverQueue', 'Arn']}
          }],
        },
      },
      MessageReceiverQueue:{
        Type: 'AWS::SQS::Queue',

      },
      MessageSenderTopic: {
        Type: 'AWS::SNS::Topic',

      },
      MessageReceiverGateway: {
        Type: 'AWS::ApiGateway::RestApi',
        Properties: {
          Name: "Message_Gateway"
        }
      }
    }

  },
  // import the function via paths
  functions: { queueHandler },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    apiGatewayServiceProxies: {
      sns: {
        path: '/sns',
        method: 'post',
        topicName: {'Fn::GetAtt' : ['MessageReceiverTopic', 'TopicName']},
        cors: true,
      },
    },
  },
};

module.exports = serverlessConfiguration;
