document.addEventListener('DOMContentLoaded', function () {
    // Récupérer la liste des noms depuis le stockage local
    let names = JSON.parse(localStorage.getItem('names')) || [];
    let schoolResults;
    updateButtonVisibility();


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
        updateButtonVisibility(); // Mettre à jour la visibilité des boutons
    }

    // Gestionnaire d'événement pour le bouton "Copier"
    document.getElementById('copyButton').addEventListener('click', function () {
        // Copier le texte de appreciationContainer dans le presse-papiers
        copyToClipboard(document.getElementById('appreciationContainer').textContent);
    });

    // Gestionnaire d'événement pour le bouton "Effacer"
    document.getElementById('clearButton').addEventListener('click', function () {
        // Effacer le contenu de appreciationContainer
        document.getElementById('appreciationContainer').textContent = '';

        // Cacher les boutons "Copier" et "Effacer"
        hideButtons();
    });

    // Fonction pour mettre à jour la visibilité des boutons en fonction du contenu de appreciationContainer
    function updateButtonVisibility() {
        let appreciationContainer = document.getElementById('appreciationContainer');
        let copyButton = document.getElementById('copyButton');
        let clearButton = document.getElementById('clearButton');

        // Afficher les boutons si appreciationContainer n'est pas vide, sinon les masquer
        if (appreciationContainer.textContent.trim() !== '') {
            copyButton.style.display = 'inline-block';
            clearButton.style.display = 'inline-block';
        } else {
            hideButtons();
        }
    }

    // Fonction pour masquer les boutons "Copier" et "Effacer"
    function hideButtons() {
        document.getElementById('copyButton').style.display = 'none';
        document.getElementById('clearButton').style.display = 'none';
    }

    // Fonction pour copier du texte dans le presse-papiers
    function copyToClipboard(text) {
        // Créer un élément textarea temporaire
        let tempTextArea = document.createElement('textarea');
        tempTextArea.value = text;

        // Ajouter l'élément textarea au document
        document.body.appendChild(tempTextArea);

        // Sélectionner le texte dans l'élément textarea
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); /* For mobile devices */

        // Copier le texte dans le presse-papiers
        document.execCommand('copy');

        // Retirer l'élément textarea du document
        document.body.removeChild(tempTextArea);

    }

    // Récupérer l'élément bouton
    var copyButton = document.getElementById('copyButton');
            
    // Ajouter un gestionnaire d'événements pour le clic
    copyButton.addEventListener('click', function() {
        // Lancer une animation de confettis depuis l'élément bouton
        party.confetti(copyButton, {
            count: party.variation.range(40, 60), // Exemple d'option
            shapes: ["square", "circle", "roundedRectangle"] // Exemple de formes
            // Ajoutez ici d'autres options de configuration selon vos besoins
        });
    });
    
});

