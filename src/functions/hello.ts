export const handle = (event) => {
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Hello Serverless'
    }),
    headres: {
      "Content-Type": "application/json"
    },
  }
}