const express = require('express');
const path = require('path');
const env = require('dotenv').config();
const nodemailer = require('nodemailer');
const { info } = require('console');

const app = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
    
}) 

//email route
app.post('/contact', (req,res) => {

    "use strict";

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: process.env.GMAIL_EMAIL, 
        pass: process.env.GMAIL_PASS, 
        },
    });
    
    // send mail with defined transport object
    let info = await transporter.sendMail({

        from: req.body.email, // sender address
        to: "jfisher396@hotmail.com", // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.message, // plain text body
        html: `<div>
                    <h3>Name: ${req.body.name}</h3>
                    <h3>Email: ${req.body.email}</h3>
                    <h3>Company: ${req.body.company}</h3>
                    <h4>Message: ${req.body.message}</h4>
                </div>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    }

    main().catch(console.error);
    res.json(req.body)

}) 

app.listen(PORT, () => {
    console.log(`You are listening on ${PORT}`)
});

//END OF LINE