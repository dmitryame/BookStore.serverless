import Photo from '../../models/photo'

// eslint-disable-next-line import/prefer-default-export
export async function main(event, context, callback) {
  // Instruct the lambda to exit immediately
  // and not wait for node event loop to be empty.
  context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign

  const { id } = event.pathParameters

  // delete photos
  // update photos
  let photo
  try {
    photo = await Photo.update(
      { active: false },
      { where: { id } },
    )

    if (photo[0] === 0) {
      const response = {
        statusCode: 404,
        body: JSON.stringify({ error: 'not found' }),
      }
      callback(null, response)
      return
    }
    // photo = await Photo.destroy({
    //   where: { id },
    // })
    // if (!photo) {
    //   const response = {
    //     statusCode: 404,
    //     body: JSON.stringify({ error: 'not found' }),
    //   }
    //   callback(null, response)
    //   return
    // }
  } catch (err) {
    console.log('Unable to delete a Photo', err)
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to delete a Photo' }),
    }
    callback(null, response)
    return
  }

  // the photo was deteled
  const response = {
    statusCode: 200,
    body: JSON.stringify({ status: 'success' }),
  }
  callback(null, response)
}
