import fs from 'fs';
import path from 'path'
export const generateCanyon = (canyon) => {
    const filePath = './.canyon_output/canyon.json';
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
    fs.writeFileSync(filePath, JSON.stringify(canyon, null, 2), 'utf-8');
}
