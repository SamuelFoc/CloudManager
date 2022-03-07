const nodemailer        = require("nodemailer");
const mailShaper        = require("../services/mailShape");


const sendPermissionMail = (req, res) => {
    const output = mailShaper.fullfillMail(req, res);

    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_NAME,
          pass: process.env.EMAIL_PASS
        },
        tls:{
            rejectUnauthorized: false
        }
      });
      
      var mailOptions = {
        from: req.body.email,
        to: process.env.EMAIL_NAME,
        subject: 'CLOUD permission request',
        text: 'Mail sended',
        html: output
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
      });
}

const givePermissionMail = (credentials) => {
  const email = credentials.email;
  const password = credentials.randPassword;
  const sendTo = credentials.email;

  const output = mailShaper.givePermMail(email, password);

  var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASS
      },
      tls:{
          rejectUnauthorized: false
      }
    });
    
    var mailOptions = {
      from: process.env.EMAIL_NAME,
      to: `${sendTo}`,
      subject: 'CLOUD access allowed',
      text: 'Mail contents your credentials',
      html: output
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
    });
}

const sendWarnMail = (sendTo, message) => {

  const output = mailShaper.warnMail(message);

  var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
          user: process.env.EMAIL_NAME,
          pass: process.env.EMAIL_PASS
      },
      tls:{
          rejectUnauthorized: false
      }
    });
    
    var mailOptions = {
      from: process.env.EMAIL_NAME,
      to: `${sendTo}`,
      subject: 'CLOUD warning',
      text: '',
      html: output
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
    });
}

module.exports = {
    sendPermissionMail,
    givePermissionMail,
    sendWarnMail
}