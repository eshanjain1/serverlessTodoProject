import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import 'source-map-support/register'
import * as uuid from 'uuid'
import { parseUserId } from '../../auth/utils'


const docClient = new AWS.DynamoDB.DocumentClient()

const tableOfTodos = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const todoID = uuid.v4()
    const authorizationHead = event.headers.Authorization

    const authorizationSplit = authorizationHead.split(" ")

    const bodParsed = JSON.parse(event.body)
    const token = authorizationSplit[1]


    const item = {
      todoId: todoID,
        userId: parseUserId(token),
        ...bodParsed
    }

    await docClient.put({
        TableName: tableOfTodos,
        Item: item
    }).promise()



    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          item
        })
    }
}
