var express=require('express')

const sessionCheck=(req,res,next)=>{
    if(req.session.user==null){
        res.redirect('/login')
    }else{
        next()
    }
}

const adminSession=(req,res,next)=>{
    if(req.session.admin==null){
        res.redirect('/admin')
    }else{
        next()
    }
}
const sessionNotLogin=(req,res,next)=>{
    if(req.session.user){
        res.redirect('/')
    }else{
        next()
    }
}


module.exports={sessionCheck:sessionCheck,adminSession:adminSession,sessionNotLogin:sessionNotLogin}