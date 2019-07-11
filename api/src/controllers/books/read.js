import Sequelize from 'sequelize'

import Photo from '../../models/photo'

// eslint-disable-next-line import/prefer-default-export
export async function main(event, context, callback) {
  // Instruct the lambda to exit immediately
  // and not wait for node event loop to be empty.
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign

  const { id } = event.pathParameters

  // retrieve photos
  let photo
  try {
    photo = await Photo.findOne({
      where: {
        id,
        active: true,
      },
      attributes: {
        include: [
          [Sequelize.literal('(SELECT COUNT("Comments") FROM "Comments" WHERE "Comments"."photoId" = "Photo"."id" and "active" = true)'), 'commentsCount'],
        ],
      },
    })
    if (!photo) {
      const response = {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': false, // Required for cookies, authorization headers with HTTPS
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        },
        body: JSON.stringify({ error: 'not found' }),
      }
      callback(null, response)
      return false
    }
  } catch (err) {
    console.log('Unable to retrieve a Photo', err)

    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': false, // Required for cookies, authorization headers with HTTPS
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      },
      body: JSON.stringify({ error: 'Unable to retrieve a Photo' }),
    }
    callback(null, response)
    return false
  }

  // Resond to request indicating the photo was created
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': false, // Required for cookies, authorization headers with HTTPS
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    },
    body: JSON.stringify({ status: 'success', photo }),
  }
  callback(null, response)
  return true
}
