import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const envLocalPath = path.resolve(process.cwd(), '.env.local');

        let envContent = '';

        if (await fileExists(envPath)) {
            envContent += await fs.readFile(envPath, 'utf-8');
        }

        if (await fileExists(envLocalPath)) {
            envContent += '\n' + await fs.readFile(envLocalPath, 'utf-8');
        }

        res.status(200).send(envContent);
    } catch (error) {
        res.status(500).send('Error reading .env files');
    }
}

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}