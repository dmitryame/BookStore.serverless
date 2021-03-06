import Book from '../../models/book'
import { corsHeaders } from '../../../../config/consts'

// eslint-disable-next-line import/prefer-default-export
export async function main(event, context, callback) {
  // Instruct the lambda to exit immediately
  // and not wait for node event loop to be empty.
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign

  // create and safe record
  let books
  try {
    books = await Book.findAll({
      order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ['title', 'ASC'],
      ],
    })
  } catch (err) {
    console.log('unable to load Books', err)
    const response = {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Unable to load Books' }),
    }
    callback(null, response)
    return false
  }

  console.log({ corsHeaders })
  // Resond to request indicating the book was created
  const response = {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      status: 'success',
      books,
    }),
  }
  callback(null, response)
  return true
}
