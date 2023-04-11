// const { phonenumberotp } = require('./usercontroller');
require('dotenv').config()
const accountSid =process.env.AUTH_SID
const authToken =  process.env.AUTH_TOKEN
const client = require('twilio')(accountSid, authToken);
const userinfo=require('../model/usermodel')
const nodemailer=require('nodemailer')


function otpvalidation(email,otpvalue){

  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "malewarderobe@gmail.com",
      pass: "gneeilmsjnhvlrxx"
    }
  })
  let docs = {
    from: "malewarderobe@gmail.com",
    to: email,
    subject: "MaleWarderobe Varification",
    text: otpvalue + " MaleWarderobe Verfication Code,Do not share with others"
  }
  mailTransporter.sendMail(docs, (err) => {
    if (err) {
      console.log(err)
    }
  })  


}


module.exports=otpvalidation


  