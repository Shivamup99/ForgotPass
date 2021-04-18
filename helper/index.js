const nodemailer = require('nodemailer')

exports.nodemailer = data=>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS:true, 
        auth: {
          user: 'shivam190445@gmail.com', 
          pass: 'Shivam@up12', 
        },
      });
      return(
          transporter.sendMail(data)
          .then(info=>
              console.log(`send mail${info.message}`)
          ).catch((err)=>{`send ${err}`})
      )
}