const middy = require('@middy/core')
const jsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const httpHeaderNormalizer = require('@middy/http-header-normalizer')
const httpMultipartBodyParser = require('@middy/http-multipart-body-parser')
const validator = require('@middy/validator')
const nodemailer = require('nodemailer')


const mail_settings = {
  host: process.env.mail_host,
  port: process.env.mail_port,
  tls: {rejectUnauthorized: (process.env.selfsigned === true) ? true : false },
  auth: {
    user: process.env.mail_user,
    pass: process.env.mail_pass
  }}

const transport = nodemailer.createTransport(mail_settings)
if (process.env.debug) {
  transport.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
})}

const baseHandler = async (event, context) => {
 if (process.env.debug) {console.log(JSON.stringify(event))};
 const message = {
        from: `${process.env.sitename} <${process.env.mail_user}>`,
        to: (process.env.mail_to) ? process.env.mail_to : process.env.mail_user,
        replyto: `${event.body['your-name']} <${event.body['your-email']}>`,
        subject: 'Ny henvendelse på hjemmeside',
        text: `Fra ${event.body['your-name']}\nEmail: ${event.body['your-email']}\nCPR: ${event.body['your-cpr']}\n\nBesked:\n${event.body['your-message']}`
     }

  return await transport.sendMail(message)
  .then(results => {
    console.warn('mail sent successfully')
    return {statusCode: 200, body: JSON.stringify("success", null)}})
  .catch(error => {
    console.warn(JSON.stringify({message, "error": error}))
    return {statusCode: 503, body: JSON.stringify("error sending mail", null)}})
};

const inputSchema = {
  type: 'object',
  properties: {
    body: {
      type: "object", // must be json object
      required: ['your-message', 'your-email', 'your-cpr', 'your-name'],
      additionalProperties: false,
      properties: {
        "your-message": {
          type: 'string',
          minLength: 10
        },
        "your-email": {
          type: 'string',
          maxLength: 200
        },
        "your-cpr": {
          "type": 'string',
          "pattern": "^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])[0-9]{2}[-]?[0-9]{4}$"
        },
        "your-name": {
          type: 'string',
          maxLength: 200
        }
      }
    }
  }
};

const outputSchema = {
  type: "object",
  required: ["body", "statusCode"],
  properties: {
    body: {
      type: "string",
    },
    statusCode: {
      type: "number",
    },
    headers: {
      type: "object",
    },
  },
};

const handler = middy(baseHandler)
  .use(httpHeaderNormalizer())
  .use(httpMultipartBodyParser())
  .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
  .use(validator({
      inputSchema: (process.env.debug) ? {} : inputSchema,
      outputSchema: (process.env.no_validate_output) ? {} : outputSchema,
      ajvOptions: {messages: true, verbose: true}
    }
    ))
  .use(httpErrorHandler({fallbackMessage: "Unhandled server exception"})) // handles common http errors and returns proper responses

module.exports = { handler };
