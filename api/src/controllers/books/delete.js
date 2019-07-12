import Book from '../../models/book'
import corsHeaders from '../../../../config/consts'

// eslint-disable-next-line import/prefer-default-export
export async function main(event, context, callback) {
  // Instruct the lambda to exit immediately
  // and not wait for node event loop to be empty.
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign

  const { id } = event.pathParameters

  // delete books
  // update photos
  try {
    const book = await Book.findOne({
      where: {
        id,
      },
    })
    if (!book) {
      callback(null, {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Book not found' }),
      })
      return false
    }
    await Book.destroy({ where: { id } })
  } catch (err) {
    console.log('Unable to delete a Book', err)
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to delete a Book' }),
    })
    return false
  }
  // the book was deteled
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ status: 'success' }),
  })
  return true
}
