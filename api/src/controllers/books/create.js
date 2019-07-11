import Book from '../../models/book'

// eslint-disable-next-line import/prefer-default-export
export async function main(event, context, callback) {
  // Instruct the lambda to exit immediately
  // and not wait for node event loop to be empty.
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign
  console.log('debug:', 1)

  const data = JSON.parse(event.body)
  console.log({ data })

  const title = data ? data.title : null
  const description = data ? data.description : null
  const author = data ? data.author : null
  const tags = data ? data.tags : null

  if (!data || !title || !description || !author || !tags) {
    console.log({
      title,
      description,
      author,
      tags,
    })
    console.log('setting status to 400')
    const response = {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': false, // Required for cookies, authorization headers with HTTPS
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      },
      body: JSON.stringify({ error: 'parameters missing' }),
    }
    callback(null, response)
    return false
  }

  // create and safe record
  let book
  try {
    book = await Book.create({
      title,
      description,
      author,
      tags,
    })
  } catch (err) {
    console.log('unable to create Book', err)
    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': false, // Required for cookies, authorization headers with HTTPS
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      },
      body: JSON.stringify({ error: 'Unable to create a new Book' }),
    }
    callback(null, response)
    return false
  }

  // Resond to request indicating the book was created
  const response = {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': false, // Required for cookies, authorization headers with HTTPS
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    },
    body: JSON.stringify({
      status: 'success',
      book,
    }),
  }
  callback(null, response)
  return true
}
