import { handlerPath } from '@libs/handler-resolver';


export default {
    handler: `${handlerPath(__dirname)}/handler.handler` ,
    events: [
        {
            sqs: {
                batchSize: 1,
                arn: {'Fn::GetAtt' : ['MessageReceiverQueue','Arn']},
            },
        },
    ],
}