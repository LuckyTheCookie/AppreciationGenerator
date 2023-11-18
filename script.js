document.addEventListener('DOMContentLoaded', function () {
    // Récupérer la liste des noms depuis le stockage local
    let names = JSON.parse(localStorage.getItem('names')) || [];

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

    let schoolResults;

    // ... (le reste de votre code)

    // Gestionnaire d'événement pour le bouton "En hausse"
    document.getElementById('enHausseButton').addEventListener('click', function () {
        schoolResults = 'up';
        console.log('School Results:', schoolResults);
    });

    // Gestionnaire d'événement pour le bouton "Moyen / Stable"
    document.getElementById('moyenStableButton').addEventListener('click', function () {
        schoolResults = 'middle';
        console.log('School Results:', schoolResults);
    });

    // Gestionnaire d'événement pour le bouton "En baisse"
    document.getElementById('enBaisseButton').addEventListener('click', function () {
        schoolResults = 'down';
        console.log('School Results:', schoolResults);
    });

    // Gestionnaire d'événement pour le bouton "Générer"
    document.getElementById('generateButton').addEventListener('click', async function () {
        // Générer une appréciation en fonction de la catégorie choisie
        let appreciation = await generateAppreciation();

        // Afficher l'appréciation sous le dropdown
        displayAppreciation(appreciation);
    });

    // Fonction pour générer une appréciation en fonction de la catégorie choisie
    async function generateAppreciation() {
        let categoryFile = `${schoolResults}.txt`; // Nom du fichier en fonction de la catégorie choisie

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

            // Déterminer si le nom commence par une voyelle
            let startsWithVowel = /^[aeiouAEIOU]/.test(selectedName);

            // Remplacer "(determinant)" par "d'" ou "de " en fonction de la voyelle
            let determinantReplacement = startsWithVowel ? "d'" : "de ";

            // Sélectionner une appréciation au hasard parmi les appréciations disponibles
            let randomIndex = Math.floor(Math.random() * data.length);
            let appreciation = data[randomIndex].replace(/\(determinant\)/g, determinantReplacement + selectedName);

            return appreciation.trim();
        } catch (error) {
            console.error(error.message);
            return ''; // Retourner une chaîne vide en cas d'échec
        }
    }

    // Fonction pour afficher l'appréciation sous le dropdown
    function displayAppreciation(appreciation) {
        let appreciationContainer = document.getElementById('appreciationContainer');
        appreciationContainer.textContent = `${appreciation}`;
    }
});