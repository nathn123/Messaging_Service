import {SQSEvent} from 'aws-lambda'
import * as AWS from 'aws-sdk'
import {middyfy} from '@libs/lambda'
import { payload, validatePayload } from '@libs/interfaces';

export const handler = middyfy( async (event:SQSEvent) => {
    //validate the inputs
    var message = event.Records.shift();
    if (validatePayload(message.body)) {
        // bad request end here
        // could be more specific
        return {statusCode: 400, body: "Bad Request"}
    }

    //pass forward to message sending topic
    const SNS  = new AWS.SNS({apiVersion: "2010-03-31"})
    var payload: payload = JSON.parse(message.body)
    
    var msgPromise = SNS.publish(payload).promise()

    msgPromise.then((data) => {
        // success
        return {statusCode: 200, body: JSON.stringify(data)}
    }).catch((data) => {
        // fail
        return {statusCode: 500, body: JSON.stringify(data)}
    })
    
})
