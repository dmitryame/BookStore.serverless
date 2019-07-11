import moment from 'moment'

import Book from '../../models/book'


// eslint-disable-next-line import/prefer-default-export
export async function main(event, context, callback) {
  // Instruct the lambda to exit immediately
  // and not wait for node event loop to be empty.
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign

  const data = JSON.parse(event.body)
  // console.log({data})

  const title = data ? data.title : null
  const description = data ? data.descrition : null
  const author = data ? data.author : null
  const tags = data ? data.tags : null

  if (!data || !title || !description || !author || !tags) {
    console.log('setting status to 400')
    const response = {
      statusCode: 400,
      body: JSON.stringify({ error: 'parameters missing' }),
    }
    callback(null, response)
    return false
  }

  const createdAt = moment()
  const updatedAt = createdAt

  // create and safe record
  let book
  try {
    book = await Book.update({
      title,
      description,
      author,
      tags,
      createdAt,
      updatedAt,
    })
  } catch (err) {
    console.log('unable to update Book', err)
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to update a Book' }),
    }
    callback(null, response)
    return false
  }

  // Resond to request indicating the book was created
  const response = {
    statusCode: 201,
    body: JSON.stringify({
      status: 'success',
      book,
    }),
  }
  callback(null, response)
  return true
}
