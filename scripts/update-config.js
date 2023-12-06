const fs = require('fs');

const filePath = './scripts/next.config.js';
const maintenanceValue = process.argv[2]; // Récupère la valeur passée en argument

if (maintenanceValue !== 'true' && maintenanceValue !== 'false') {
    console.error('Veuillez passer "true" ou "false" en tant qu\'argument.');
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
        console.log(`La variable "maintenance" a été mise à jour avec succès avec la valeur ${maintenanceValue} !`);
    });
});