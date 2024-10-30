import mongoose from 'mongoose';
import Mailchimp from '@mailchimp/mailchimp_marketing';

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for the waitlist
const WaitlistSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
});
const Waitlist = mongoose.models.Waitlist || mongoose.model('Waitlist', WaitlistSchema);

// Initialize Mailchimp
Mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
});

// API Route to handle form submission
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email } = req.body;

        try {
            // Save to MongoDB
            const newEntry = new Waitlist({ email });
            await newEntry.save();

            // Add to Mailchimp list
            await Mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
                email_address: email,
                status: 'subscribed',
            });

            return res.status(201).json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
