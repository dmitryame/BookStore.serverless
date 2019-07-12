import Book from '../../models/book'
import corsHeaders from '../../../../config/consts'

// eslint-disable-next-line import/prefer-default-export
export async function main(event, context, callback) {
  // Instruct the lambda to exit immediately
  // and not wait for node event loop to be empty.
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign

  const { id } = event.pathParameters

  const data = JSON.parse(event.body)
  // console.log({data})

  const title = data ? data.title : null
  const description = data ? data.description : null
  const author = data ? data.author : null
  const tags = data ? data.tags : null

  if (!data && !title && !description && !author && !tags) {
    console.log('setting status to 400')
    const response = {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'parameters missing' }),
    }
    callback(null, response)
    return false
  }

  const books = await Book.findAll({
    where: {
      id,
    },
  })
  if (books.length === 0) {
    const response = {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Book not found' }),
    }
    callback(null, response)
    return false
  }

  //  safe record

  try {
    await Book.update(
      {
        title,
        description,
        author,
        tags,
      },
      { where: { id } },
    )
  } catch (error) {
    console.log('unable to update Book', error)
    const response = {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ status: 'Unable to update a Book', error }),
    }
    callback(null, response)
    return false
  }

  // Resond to request indicating the book was updated
  const response = {
    statusCode: 201,
    body: JSON.stringify({
      status: 'success',
      headers: corsHeaders,
    }),
  }
  callback(null, response)
  return true
}
