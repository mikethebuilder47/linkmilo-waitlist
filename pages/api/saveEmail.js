const fs = require('fs');
import path from 'path';

const filePath = path.resolve(process.cwd(), 'emails.csv'); // Path to your CSV file

// Middleware to check for duplicates
function checkDuplicate(email) {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8').split('\n');
        return data.includes(email);
    }
    return false;
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        const email = req.body.email.trim();

        // Check for duplicates
        if (checkDuplicate(email)) {
            return res.status(400).json({ success: false, message: 'Email already submitted.' });
        }

        // Append new email to the CSV file
        fs.appendFile(filePath, `${email}\n`, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Error saving email' });
            }
            res.status(201).json({ success: true });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
