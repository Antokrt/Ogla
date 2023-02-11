export const DateNow = () => {
   let today = new Date();
   let dd = String(today.getDate()).padStart(2, '0');
   let mm = String(today.getMonth() + 1).padStart(2, '0');
   let yyyy = today.getFullYear();
   today = dd + '/' + mm + '/' + yyyy;
   return today;
}

export const FormatDateNb = (timestamp) => {
   const date = new Date(parseInt(timestamp));
   const jour = date.getDate().toString().padStart(2, '0');
   const mois = (date.getMonth() + 1).toString().padStart(2, '0');
   const annee = date.getFullYear();
   return `${jour}/${mois}/${annee}`;
}

export const FormatDateStr = (timestamp) => {
   const date = new Date(timestamp);
   const jour = date.getDate().toString().padStart(2, '0');
   const mois = date.getMonth();
   const annee = date.getFullYear();
   const moisNoms = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
   return `${jour} ${moisNoms[mois]} ${annee}`;
}