const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {nodemailer} = require('../helper/index')
const {check , validationResult} = require('express-validator')
const router = express.Router()


router.post("/register",[
    check("name").isString(),
    check("email").isEmail(),
    check('password').isAlphanumeric()
], async(req,res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()) return res.status(422).json({message:error.message})

    let user = await User.findOne({email:req.body.email})
    if(user){
        res.status(400).json('user exists')
    } else{
        user = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        })

        const salt = await bcrypt.genSalt(12)
        user.password = await bcrypt.hash(user.password , salt)

        await user.save()
        res.status(200).json(user)
    }
})

router.post('/login',[
    check('email').isEmail(),
    check('password').isAlphanumeric()
], async(req,res)=>{
    const error = validationResult(req)
    if(!error.isEmpty())
    return res.status(422).json({message:error.message})

    let user = await User.findOne({email:req.body.email})
    if(!user){
        res.status(400).json('email not found')
    } else{
        let isMatch = await bcrypt.compare(req.body.password,user.password)
        if(!isMatch) return res.status(402).json('password wrong')

        const token = await jwt.sign({_id:user._id},process.env.Key)
        res.status(200).json(token)
    }
})

router.put('/forgot',async(req,res)=>{
    const {email} = req.body
    const user = await User.findOne({email:email})
    if(!user){
        return res.status(200).json({
            message:'Email is wrong'
        })
    }
    const token = await jwt.sign({_id:user._id},process.env.Key)
    await user.updateOne({resetPasswordLink : token})

    const templateEmail ={
        from:'shivam190445@gmail.com',
        to:email,
        subject:'link reset password',
        html:`<p> click link </p> <p>${process.env.CLINT_URL}/resetpassword/${token}</p> `
    }
    nodemailer(templateEmail)
    return res.status(200).json({message:req.body.email})
})

module.exports = router