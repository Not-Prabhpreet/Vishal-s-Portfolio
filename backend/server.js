require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Configure rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: eval(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware
app.use(helmet()); // Adds security headers
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Restrict to your website
  methods: ['POST'], // Only allow POST requests for the contact form
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Apply rate limiting to form submissions
app.use('/api/contact', limiter);

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use an app password if using Gmail
  }
});

// Test email configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Server could not be configured to send emails:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  // Get form data
  const { name, email, subject, message } = req.body;
  
  // Validate form data
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
  }
  
  // Email validation with regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
  }
  
  try {
    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'vkyadav@mun.ca', // Vishal's email address
      replyTo: email,
      subject: `Website Contact Form: ${subject}`,
      html: `
        <h3>New Message from Website Contact Form</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Send confirmation email to the sender
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Vishal Yadav',
      html: `
        <h3>Thank you for your message!</h3>
        <p>Dear ${name},</p>
        <p>I have received your message and will get back to you as soon as possible.</p>
        <p>Below is a copy of your message:</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p>Best regards,</p>
        <p>Vishal Yadav</p>
        <p>PhD Candidate in Mathematics</p>
        <p>Memorial University of Newfoundland and Labrador</p>
      `
    };
    
    await transporter.sendMail(confirmationMailOptions);
    
    // Send success response
    res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later or contact directly via email.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});