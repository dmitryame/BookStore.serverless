import Book from '../../models/book'
import { corsHeaders } from '../../../../config/consts'

// eslint-disable-next-line import/prefer-default-export
export async function main(event, context, callback) {
  // Instruct the lambda to exit immediately
  // and not wait for node event loop to be empty.
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign

  const { id } = event.pathParameters

  // retrieve books
  let book
  try {
    book = await Book.findOne({
      where: {
        id,
      },
    })
    if (!book) {
      const response = {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Book not found' }),
      }
      callback(null, response)
      return false
    }
  } catch (err) {
    console.log('Unable to retrieve a Book', err)

    const response = {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Unable to retrieve a Book' }),
    }
    callback(null, response)
    return false
  }

  // Resond to request indicating the book was created
  const response = {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ status: 'success', book }),
  }
  callback(null, response)
  return true
}
