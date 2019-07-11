import moment from 'moment'

import Photo from '../../models/photo'
import AbuseReport from '../../models/abuseReport'

const AWS = require('aws-sdk')

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

  const c = await AbuseReport.count({ where: { uuid } })
  console.log(`count of abuse: ${c}`)
  if (c > 3) {
    const response = {
      statusCode: 401,
      body: JSON.stringify({ error: 'Anauthorized.' }),
    }
    callback(null, response)
    return false
  }

  console.log('uuid:', uuid)
  console.log('location:', location)

  const createdAt = moment()
  const updatedAt = createdAt

  // create and safe record
  let photo
  try {
    photo = await Photo.create({
      uuid,
      location,
      likes,
      createdAt,
      updatedAt,
    })
  } catch (err) {
    console.log('unable to create Photo', err)
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to create a new Photo' }),
    }
    callback(null, response)
    return false
  }

  const s3 = new AWS.S3()
  const s3Params = {
    Bucket: process.env.IMAGE_BUCKET,
    Key: `${photo.id}`,
    ContentType: 'image/jpeg',
    Expires: 60, // expires in 1 minute, after that request a new URL
    ACL: 'public-read',
  }
  const uploadURL = s3.getSignedUrl('putObject', s3Params)

  // Resond to request indicating the photo was created
  const response = {
    statusCode: 201,
    body: JSON.stringify({
      status: 'success',
      uploadURL,
      photo,
    }),
  }
  callback(null, response)
  return true
}
