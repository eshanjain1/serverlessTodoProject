import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import 'source-map-support/register'
//import { parseUserId } from '../../auth/utils'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'


const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const todoIDENTI = event.pathParameters.todoId
  const todo_update: UpdateTodoRequest = JSON.parse(event.body)

  const tableOfTodos = process.env.TODOS_TABLE



  const todoUpdateReq = {
    TableName: tableOfTodos,
    Key: { "todoId": todoIDENTI },
    UpdateExpression: "set #n = :a, dueDate = :b, done = :c",
    ExpressionAttributeValues:{
      ":a": todo_update['name'],
      ":b": todo_update.dueDate,
      ":c": todo_update.done
    },
    ExpressionAttributeNames:{
      "#n": "name"
    },
    ReturnValues:"UPDATED_NEW"
  }

const updating = await docClient.update(todoUpdateReq).promise()




return {
    statusCode: 201,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      updating
    })
}
}
