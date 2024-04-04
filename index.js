const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const cron = require('node-cron');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

const backendUrl = 'https://ecoblocks-server.onrender.com/send-email';

// Schedule a cron job to ping the backend URL every 14 minutes
cron.schedule('*/14 * * * *', () => {
  https.get(backendUrl, (res) => {
    if (res.statusCode === 200) {
      console.log('Server is running.');
    } else {
      console.log('Server may be sleeping.');
    }
  }).on('error', (error) => {
    console.error('Error pinging the server:', error);
  });
});

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

const sendMail = async (data, subject, receiverEmail) => {
    try {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: "AACBlocks Nepal" , // sender address
            to: receiverEmail, // list of receivers
            subject: subject, // Subject line
            html: `
                <h3>Contact Details</h3>
                <ul>
                    <li><strong>First Name:</strong> ${data.firstname}</li>
                    <li><strong>Last Name:</strong> ${data.lastname}</li>
                    <li><strong>Contact Number:</strong> ${data.number}</li>
                    <li><strong>Location for Dealership:</strong> ${data.location}</li>
                    <li><strong>Email:</strong> ${data.email}</li>
                    <li><strong>Expected Annual Turnover in NPR:</strong> ${data.turnover}</li>
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

// POST route to handle general contact form submission
app.post('/send-email', async (req, res) => {
    try {
        const result = await sendMail(req.body, 'New Contact Form Submission', 'codersaro@gmail.com');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// POST route to handle dealer form submission
app.post('/send-dealer-email', async (req, res) => {
    try {
        const result = await sendMail(req.body, 'New Dealer Inquiry', 'codersaro@gmail.com');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
