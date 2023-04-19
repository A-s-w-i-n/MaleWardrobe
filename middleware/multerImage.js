const express = require('express')
const app = express()
const multer=require('multer')
const path =require('path')

const bodyParser =require('body-parser')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/productimages")
    },
    filename:function(req,file,cb){
        const name =Date.now()+"-"+file.originalname
        cb(null,name)
    }
})

 const fileFilter=function(req,file,cb){
    const fileTyps=/jpeg|jpg|png|gif|avif|webp/

    const extname=fileTyps.test(path.extname(file.originalname).toLowerCase())

    const mimetype=fileTyps.test(file.mimetype)
    if(mimetype&&extname){
        return cb(null,true)

    }else{
        cb("Error: Images Only")
    }
 }

const upload =multer({
    storage:storage,
    fileFilter:fileFilter
})

module.exports={upload}