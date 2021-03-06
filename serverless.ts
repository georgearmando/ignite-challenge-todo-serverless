import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'todoserverless',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    'serverless-dynamodb-local',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:*',
        ],
        Resource: [
          '*'
        ]
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    createToDo: {
      handler: './src/functions/createToDo.handle',
      events: [
        {
          http: {
            path: '/todos/{user_id}',
            method: 'post',
            cors: true,
          }
        },
      ],
    },
    getAllToDos: {
      handler: './src/functions/getAllToDos.handle',
      events: [
        {
          http: {
            path: '/todos/{user_id}',
            method: 'get',
            cors: true,
          }
        },
      ],
    },
  },
  package: { individually: true },
  resources: {
    Resources: {
      dbToDo: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'users-todo',
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            }
          ]
        }
      }
    }
  },
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
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      }
    },
  },
};

module.exports = serverlessConfiguration;