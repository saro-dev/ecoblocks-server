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
            from: "AACBlocks Nepal <recipeeze.contact@gmail.com>", // sender address
            to: receiverEmail, // list of receivers
            subject: subject, // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #007bff; text-align: center; margin-bottom: 20px;">New Dealer Inquiry</h2>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
                        <h3 style="color: #007bff; margin-bottom: 15px;">Contact Details</h3>
                        <ul style="list-style-type: none; padding: 0;">
                            <li style="margin-bottom: 10px;"><strong>First Name:</strong> ${data.firstname}</li>
                            <li style="margin-bottom: 10px;"><strong>Last Name:</strong> ${data.lastname}</li>
                            <li style="margin-bottom: 10px;"><strong>Contact Number:</strong> ${data.number}</li>
                            <li style="margin-bottom: 10px;"><strong>Location for Dealership:</strong> ${data.location}</li>
                            <li style="margin-bottom: 10px;"><strong>Email:</strong> ${data.email}</li>
                            <li style="margin-bottom: 10px;"><strong>Expected Annual Turnover in NPR:</strong> ${data.turnover}</li>
                        </ul>
                        <h3 style="color: #007bff; margin-top: 20px; margin-bottom: 15px;">Message</h3>
                        <p>${data.message}</p>
                    </div>
                </div>
            `
        });

        console.log('Message sent: %s', info.messageId);
        return { success: true, message: 'Your message was sent, thank you!' };
    } catch (error) {
        console.error('Error occurred:', error);
        return { success: false, message: 'There was an error sending your message. Please try again later.' };
    }
};

//email to send contact info
const sendMail2 = async (data, subject, receiverEmail) => {
    try {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: "AACBlocks Nepal <recipeeze.contact@gmail.com>", // sender address
            to: receiverEmail, // list of receivers
            subject: subject, // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #007bff; text-align: center; margin-bottom: 20px;">New Contact Form Submission</h2>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
                        <h3 style="color: #007bff; margin-bottom: 15px;">Here's what they said</h3>
                        <ul style="list-style-type: none; padding: 0;">
                            <li style="margin-bottom: 10px;"><strong>Name:</strong> ${data.name}</li>
                            <li style="margin-bottom: 10px;"><strong>Contact Number:</strong> ${data.contactNumber}</li>
                            <li style="margin-bottom: 10px;"><strong>Email:</strong> ${data.email}</li>
                        </ul>
                        <h3 style="color: #007bff; margin-top: 20px; margin-bottom: 15px;">Message</h3>
                        <p>${data.message}</p>
                    </div>
                </div>
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
        const result = await sendMail2(req.body, 'New Contact Form Submission', 'codersaro@gmail.com');
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
