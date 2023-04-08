// const { phonenumberotp } = require('./usercontroller');
require('dotenv').config()
const accountSid =process.env.AUTH_SID
const authToken =  process.env.AUTH_TOKEN
const client = require('twilio')(accountSid, authToken);
const userinfo=require('../model/usermodel')
const nodemailer=require('nodemailer')


function otpvalidation(email,otpvalue){
//     client.messages
//       .create({
//          body: otpvalue,
//          from: '+15675571837',
//          to: '+91'+phone
//        })
//       .then(message => console.log(message.sid));

// }
// const userPostOtpLogin = async function (req, res, next) {
  // let checkmail = await userinfo.findOne({ email: req.body.email })
  // let OtpCode = Math.floor(100000 + Math.random() * 900000)
//   otp = OtpCode
  // otpEmail = checkmail.email
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
// const userPostOtp = async function (req, res, next) {
//   if (req.body.otp == otp) {
//     let loger = await userdata.find({ useremail: otpEmail })
//     req.session.user = loger[0].username
//     name = loger[0].fullname
//     console.log(loger);
//     res.redirect('/')
//   } else {
//     res.redirect('/loginotp')
//   }
// }

module.exports=otpvalidation


  