const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Create a SMTP transporter object
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL/TLS
    auth: {
      user: 'recipeeze.contact@gmail.com',
      pass: 'fnjl wmoq licf ogtb', // Use an App Password or your account password
    },
  });

const sendMail = async (data) => {
    try {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: "AACBlocks Nepal" , // sender address
            to: 'codersaro@gmail.com', // list of receivers
            subject: 'New Contact Form Submission', // Subject line
            html: `
                <h3>Contact Details</h3>
                <ul>
                    <li><strong>Name:</strong> ${data.name}</li>
                    <li><strong>Contact Number:</strong> ${data.contactNumber}</li>
                    <li><strong>Email:</strong> ${data.email}</li>
                </ul>
                <h3>Message</h3>
                <p>${data.message}</p>
            `
        });

        console.log('Message sent: %s', info.messageId);
        return { success: true, message: 'Your message was sent, thank you!' };
    } catch (error) {
        console.error('Error occurred:', error);
        return { success: false, message: 'There was an error sending your message. Please try again later.' };
    }
};

// POST route to handle form submission
app.post('/send-email', async (req, res) => {
    try {
        const result = await sendMail(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
