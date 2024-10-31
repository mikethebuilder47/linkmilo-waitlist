// pages/api/saveEmail.js
import fs from 'fs';
import path from 'path';
import lockfile from 'lockfile';

const lockPath = path.resolve(process.cwd(), 'emails.lock'); // Create a lock file
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

        // Append new email to the CSV file with locking
        lockfile.lock(lockPath, async (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Could not lock the file.' });
            }
            try {
                // Append logic here
                fs.appendFileSync(filePath, `${email}\n`);
                res.status(201).json({ success: true });
            } catch (e) {
                console.error(e);
                res.status(500).json({ success: false, message: 'Error saving email' });
            } finally {
                lockfile.unlock(lockPath, (unlockErr) => {
                    if (unlockErr) {
                        console.error('Failed to unlock file:', unlockErr);
                    }
                });
            }
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
