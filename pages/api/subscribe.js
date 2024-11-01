// pages/api/subscribe.js

import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export default async (req, res) => {
  if (req.method !== 'POST') {
    // Return a 405 Method Not Allowed if not a POST request
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  const { email } = req.body;

  if (!email) {
    // Return a 400 Bad Request if email is not provided
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // Add or update the subscriber in Mailchimp
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: email,
      status: 'subscribed',
    });

    // Successfully added
    return res.status(200).json({ success: true, message: 'Thank you for subscribing!' });
  } catch (error) {
    console.error('Mailchimp Error:', error);

    // Handle errors from Mailchimp API
    if (error.response && error.response.body) {
      const { title, detail, status } = error.response.body;
      return res.status(status).json({ success: false, message: detail });
    }

    // Generic error message
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
