// const { phonenumberotp } = require('./usercontroller');
require('dotenv').config()
const accountSid =process.env.AUTH_SID
const authToken =  process.env.AUTH_TOKEN
const client = require('twilio')(accountSid, authToken);


function otpvalidation(phone,otpvalue){
    client.messages
      .create({
         body: otpvalue,
         from: '+15675571837',
         to: '+91'+phone
       })
      .then(message => console.log(message.sid));

}

module.exports=otpvalidation


  