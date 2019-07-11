// eslint-disable-next-line import/prefer-default-export
export async function main(event, context, callback) {
  // parameters passed into the call
  // console.log("debug:", 1)

  const message = 'Hello WiSaw world!'

  let response

  try {
    response = {
      statusCode: 200,
      body: JSON.stringify(message),
    }
    // console.log("debug:", 4)
    callback(null, response)
  } catch (error) {
    console.log('error from calling API:', error.response.data)

    response = {
      statusCode: 500,
      body: JSON.stringify(error.response.data),
    }
    callback(null, response)
  }
}
