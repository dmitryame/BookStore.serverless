import Book from '../../models/book'

// eslint-disable-next-line import/prefer-default-export
export async function main(event, context, callback) {
  // Instruct the lambda to exit immediately
  // and not wait for node event loop to be empty.
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign

  const { id } = event.pathParameters

  // delete books
  // update photos
  try {
    await Book.destroy({ where: { id } })
  } catch (err) {
    console.log('Unable to delete a Book', err)
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to delete a Book' }),
    }
    callback(null, response)
    return
  }

  // the book was deteled
  const response = {
    statusCode: 200,
    body: JSON.stringify({ status: 'success' }),
  }
  callback(null, response)
}
