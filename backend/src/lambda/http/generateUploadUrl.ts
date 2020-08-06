import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'


import * as uuid from 'uuid'
import 'source-map-support/register'


const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoID = event.pathParameters.todoId

  console.log(todoID)
  const s3_buck = process.env.S3_BUCKET


  const signed_url_expir = process.env.SIGNED_URL_EXPIRATION
  const picID = uuid.v4()
  const tableOfTodos = process.env.TODOS_TABLE



  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })
  const url = s3.getSignedUrl('putObject',{
    Bucket: s3_buck,
    Key: picID,
    Expires: signed_url_expir
  })



  const picURL = `https://${s3_buck}.s3.amazonaws.com/${picID}`

  const updateUrlOnTodo = {
    TableName: tableOfTodos,
    Key: { "todoId": todoID },
    UpdateExpression: "set attachmentUrl = :a",
    ExpressionAttributeValues:{
      ":a": picURL
  },
  ReturnValues:"UPDATED_NEW"
  }


await docClient.update(updateUrlOnTodo).promise()

  return {
      statusCode: 201,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
          iamgeUrl: picURL,
          uploadUrl: url
      })
  }
}
