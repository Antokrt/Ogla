const fs = require('fs');

const filePath = './next.config.js';
const maintenanceValue = process.argv[2];

if (maintenanceValue !== 'true' && maintenanceValue !== 'false') {
    console.error('true or false required...');
    process.exit(1);
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error when reading the file :', err);
        return;
    }

    const updatedData = data.replace(/(maintenance:\s*)(true|false)/, `$1${maintenanceValue}`);

    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
        if (err) {
            console.error('Erreur when writing the file :', err);
            return;
        }
        console.log(`Maintenance is successfully ${maintenanceValue ? 'ON':'OFF'}`);
    });
});