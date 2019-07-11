import moment from 'moment'

import Book from '../../models/book'

// eslint-disable-next-line import/prefer-default-export
export async function main(event, context, callback) {
  // Instruct the lambda to exit immediately
  // and not wait for node event loop to be empty.
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign

  const data = JSON.parse(event.body)
  // console.log({data})

  const uuid = data ? data.uuid : null
  const location = data ? data.location : null
  const likes = 0 // have to privude default value since this column does not allow nulls

  if (!data || !uuid || !location) {
    console.log('setting status to 400')
    const response = {
      statusCode: 400,
      body: JSON.stringify({ error: 'parameters missing' }),
    }
    callback(null, response)
    return false
  }

  console.log('uuid:', uuid)
  console.log('location:', location)

  const createdAt = moment()
  const updatedAt = createdAt

  // create and safe record
  let book
  try {
    book = await Book.create({
      uuid,
      location,
      likes,
      createdAt,
      updatedAt,
    })
  } catch (err) {
    console.log('unable to create Book', err)
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to create a new Book' }),
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
