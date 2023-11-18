document.addEventListener('DOMContentLoaded', function () {
    // Récupérer la liste des noms depuis le stockage local
    let names = JSON.parse(localStorage.getItem('names')) || [];
    let gender;
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

    // Gestionnaire d'événement pour le bouton "En hausse"
    document.getElementById('upButton').addEventListener('click', function () {
        schoolResults = 'up';
        console.log('School Results:', schoolResults);
    });

    // Gestionnaire d'événement pour le bouton "Moyen / Stable"
    document.getElementById('middleButton').addEventListener('click', function () {
        schoolResults = 'middle';
        console.log('School Results:', schoolResults);
    });

    // Gestionnaire d'événement pour le bouton "En baisse"
    document.getElementById('downButton').addEventListener('click', function () {
        schoolResults = 'down';
        console.log('School Results:', schoolResults);
    });

    // Gestionnaire d'événement pour le bouton "Homme"
    document.getElementById('hommeButton').addEventListener('click', function () {
        gender = 'boys';
        console.log('Gender:', gender);
    });

    // Gestionnaire d'événement pour le bouton "Femme"
    document.getElementById('femmeButton').addEventListener('click', function () {
        gender = 'girls';
        console.log('Gender:', gender);
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
        let categoryFile = `${schoolResults}-${gender}.txt`; // Nom du fichier en fonction de la catégorie et du genre choisis
        
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
            let appreciation = '';
            while (appreciation.trim() === '') {
                let randomIndex = Math.floor(Math.random() * data.length);
                appreciation = data[randomIndex].replace(/\(determinant\)/g, determinantReplacement + selectedName);
            }

            return appreciation.trim();
        } catch (error) {
            console.error(error.message);
            return 'Erreur lors de la génération de l\'appréciation'; // Retourner un message d'erreur en cas d'échec
        }
    }

    // Fonction pour afficher l'appréciation sous le dropdown
    function displayAppreciation(appreciation) {
        let appreciationContainer = document.getElementById('appreciationContainer');
        appreciationContainer.textContent = `${appreciation}`;
    }
});