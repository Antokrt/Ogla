const fs = require('fs');

const filePath = './next.config.js';
const maintenanceValue = process.argv[2]; // Récupère la valeur passée en argument

if (maintenanceValue !== 'true' && maintenanceValue !== 'false') {
    console.error('true or false required...');
    process.exit(1);
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Erreur de lecture du fichier :', err);
        return;
    }

    const updatedData = data.replace(/(maintenance:\s*)(true|false)/, `$1${maintenanceValue}`);

    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
        if (err) {
            console.error('Erreur d\'écriture dans le fichier :', err);
            return;
        }
        console.log(`Maintenance is successfully ${maintenanceValue ? 'on':'off'}`);
    });
});