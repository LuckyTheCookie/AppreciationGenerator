document.addEventListener('DOMContentLoaded', function () {
    // Récupérer la liste des noms depuis le stockage local
    let names = JSON.parse(localStorage.getItem('names')) || [];
    let schoolResults;


    // Fonction pour générer le dropdown avec les noms
    function generateNameDropdown() {
        let dropdown = document.getElementById('nameDropdown');

        // Effacer le contenu actuel du dropdown
        dropdown.innerHTML = '';

        // Ajouter une option par nom dans la liste
        names.forEach(function (name) {
            let option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            dropdown.appendChild(option);
        });
    }

    // Appeler la fonction pour générer le dropdown au chargement de la page
    generateNameDropdown();

    // Gestionnaires d'événements pour chaque bouton
    ['noWorkButton', 'badButton', 'difficultButton', 'justButton', 'absentButton', 'minimumButton', 'attitudeButton', 'encouragementButton', 'perfectButton'].forEach(function (buttonId) {
        document.getElementById(buttonId).addEventListener('click', async function () {
            schoolResults = buttonId.toLowerCase().replace('button', ''); // Extraire la catégorie à partir de l'ID du bouton
            console.log('School Results:', schoolResults);

            // Générer une appréciation en fonction de la catégorie choisie
            let appreciation = await generateAppreciation();

            // Afficher l'appréciation sous le dropdown
            displayAppreciation(appreciation);
        });
    });

    // Fonction pour générer une appréciation en fonction de la catégorie choisie
    async function generateAppreciation() {
        let categoryFile = `./Appreciations/${schoolResults}.txt`; // Nom du fichier en fonction de la catégorie choisie
        
        try {
            // Utiliser Fetch API pour charger le contenu du fichier
            let response = await fetch(categoryFile);

            if (!response.ok) {
                throw new Error(`Erreur de chargement du fichier ${categoryFile}`);
            }

            // Diviser le contenu du fichier en utilisant le marqueur "(end)"
            let data = (await response.text()).split(/\(end\)/);

            // Récupérer le nom sélectionné dans le dropdown
            let selectedName = document.getElementById('nameDropdown').value;

            // Déterminer si le nom commence par une voyelle ou un H
            let startsWithVowel = /^[aeiouhAEIOUH]/.test(selectedName);

            // Remplacer "(determinant)" par "d'" ou "de " en fonction de la voyelle
            let determinantReplacement = startsWithVowel ? "d'" : "de ";

            // Remplacer "X" par le nom sélectionné dans chaque ligne
            data = data.map(line => line.replace(/X/g, selectedName));

            // Sélectionner une appréciation au hasard parmi les appréciations disponibles
            let appreciation = '';
            while (appreciation.trim() === '') {
                let randomIndex = Math.floor(Math.random() * data.length);
                appreciation = data[randomIndex].replace(/\(determinant\)/g, determinantReplacement + selectedName);
            }

            return appreciation.trim();
        } catch (error) {
            console.error(error.message);
            return 'Je suis désolé, mais une erreur est survenue. C\'est assez étrange... Redémarrez la page puis réessayez :)'; // Retourner un message d'erreur en cas d'échec
        }
    }

    // Fonction pour afficher l'appréciation sous le dropdown
    function displayAppreciation(appreciation) {
        let appreciationContainer = document.getElementById('appreciationContainer');
        appreciationContainer.textContent = `${appreciation}`;
    }
});