export const GetCategory = () => {
    const list = ['action', 'drama', 'horreur', 'comédie', 'fantaisie', 'sf','autre'];
    return list;
}


export const GetPresentationOfCategory = (cat) => {
    switch (cat) {
        case 'action': {
            return 'Plongez dans l\'action effrénée de nos histoires captivantes et embarquez pour des aventures palpitantes remplies de combats épiques, de poursuites haletantes et de rebondissements inattendus !';
        }

        case 'fantaisie': {
            return 'Plongez dans des histoires de fantaisie époustouflantes, où les rois et les reines, les chevaliers et les sorciers, les elfes et les dragons se côtoient dans des mondes étonnants remplis de dangers et de merveilles. Laissez-vous transporter dans des univers épiques où l\'imagination n\'a pas de limites.';
        }

        case 'drama': {
            return 'Plongez dans des histoires dramatiques qui explorent les relations humaines complexes et les épreuves de la vie. Suivez des personnages touchants et émouvants dans des récits poignants qui abordent des thèmes universels tels que l\'amour, la perte et la rédemption.';
        }

        case 'horreur': {
            return 'Plongez dans des histoires d\'horreur effrayantes qui vous feront vivre des moments de terreur intenses. Suivez des héros qui luttent contre des forces maléfiques et des créatures cauchemardesques dans des récits qui vous tiendront en haleine jusqu\'à la fin.';
        }

        case 'sf': {
            return 'Plongez dans des récits de science-fiction qui vous feront voyager à travers le temps et l\'espace. Découvrez des univers fascinants, des êtres étranges et des technologies incroyables dans des histoires qui stimulent l\'imagination et vous transportent dans des mondes inconnus.';
        }

        case 'comédie': {
            return 'Si vous cherchez à vous divertir et à vous détendre, notre collection de comédies est là pour vous ! Découvrez des histoires drôles et légères, des personnages attachants et des situations cocasses qui vous feront passer un moment de lecture inoubliable.\n' +
                '\n'
        }

        case 'autre':{
            return 'Explorez un monde de créativité sans limites. Découvrez des récits uniques et des écrits avant-gardistes qui défient les conventions. Laissez votre imagination s\'évader à travers des histoires captivantes où chaque page réserve une surprise. Bienvenue dans l\'univers littéraire sans frontières où la seule limite est votre imagination.\n' +
                '\n'
        }

        default : {
            return 'Découvrez notre sélection de catégories de livres pour tous les goûts et tous les âges. Plongez dans des histoires passionnantes, explorez des mondes imaginaires et découvrez des personnages inoubliables dans notre vaste collection de livres. Que vous soyez fan de romans d\'aventure, de thrillers, de romances ou de science-fiction, nous avons quelque chose pour vous. Parcourez notre sélection et laissez-vous emporter par des histoires qui captiveront votre imagination et éveilleront votre curiosité.';
        }
    }
}