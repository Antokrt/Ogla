export const DateNow = () => {
   let today = new Date();
   let dd = String(today.getDate()).padStart(2, '0');
   let mm = String(today.getMonth() + 1).padStart(2, '0');
   let yyyy = today.getFullYear();
   today = dd + '/' + mm + '/' + yyyy;
   return today;
}

export const FormatDateNb = (timestamp) => {
   const date = new Date(timestamp);
   const jour = date.getDate().toString().padStart(2, '0');
   const mois = (date.getMonth() + 1).toString().padStart(2, '0');
   const annee = date.getFullYear();
   return `${jour}/${mois}/${annee}`;
};

export const FormatDateStr = (timestamp) => {
   const date = new Date(timestamp);
   const jour = date.getDate().toString().padStart(2, '0');
   const mois = date.getMonth();
   const annee = date.getFullYear();
   const moisNoms = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
   return `${jour} ${moisNoms[mois]} ${annee}`;
}

export const FormatDateFrom = (timestamp) => {
   const currentDate = new Date();
   const date = new Date(timestamp);
   const diffTime = Math.abs(currentDate - date);
   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
   const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
   const diffMinutes = Math.floor(diffTime / (1000 * 60));

   if (diffDays > 1) {
      return `${date.toLocaleDateString()}`;
   } else if (diffDays === 1) {
      return `Il y a ${diffDays} jour`;
   } else if (diffHours > 1) {
      return `Il y a ${diffHours} heures`;
   } else if (diffHours === 1) {
      return `Il y a ${diffHours} heure`;
   } else if (diffMinutes > 1) {
      return `Il y a ${diffMinutes} minutes`;
   } else {
      return `Il y a quelques secondes...`;
   }
}
