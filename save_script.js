document.addEventListener('DOMContentLoaded', function() {
    // Sélectionnez le bouton d'export
    var exportBtn = document.getElementById('exportButton');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }

    // Sélectionnez le bouton d'import et créez un gestionnaire de clic qui active un input de fichier caché
    var importBtn = document.getElementById('importButton');
    if (importBtn) {
        importBtn.addEventListener('click', function() {
            importInput.click(); // Cela va ouvrir la boite de dialogue pour sélectionner le fichier
        });
    }

    // Créez l'input de fichier pour l'importation et ajoutez un gestionnaire de changement
    var importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.style.display = 'none'; // Cacher l'input
    importInput.onchange = importData;
    // Ajouter cet élément à la page si nécessaire
    document.body.appendChild(importInput);

    

function exportData() {
    // Ici vous devez récupérer vos données sauvegardées dans l'objet "names"
    // Par exemple, si vous utilisez localStorage, cela peut ressembler à ceci:
    var namesData = localStorage.getItem('names'); // Remplacer 'names' par la clé que vous utilisez pour stocker

    // Créer un blob avec vos données
    var blob = new Blob([namesData], { type: 'application/json' });

    // Créer un URL pour le blob
    var dataUrl = URL.createObjectURL(blob);

    // Créer un élément de lien temporaire pour télécharger le fichier
    var link = document.createElement('a');
    link.href = dataUrl;
    link.download = "names.json"; // Nom du fichier à télécharger

    // Simuler un clic sur le lien pour déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Attacher l'événement click à votre bouton d'exportation
document.getElementById('exportButton').addEventListener('click', exportData);


function importData(event) {
    var file = event.target.files[0];

    if (file) {
        // Créer un FileReader pour lire le fichier
        var reader = new FileReader();

        // Définir l'événement onload pour récupérer le contenu du fichier
        reader.onload = function(e) {
            var contents = e.target.result;

            // Avant de sauvegarder, vous voudrez peut-être valider ou analyser vos données
            // Si vos données sont un JSON, vous pouvez les convertir en objet
            try {
                var jsonData = JSON.parse(contents);

                // Ici, vous pouvez maintenant sauvegarder vos données
                localStorage.setItem('names', JSON.stringify(jsonData)); // Remplacer 'names' par la clé que vous utilisez pour stocker
                alert('Données importées avec succès!');
                
                // Vous souhaitez peut-être mettre à jour l'interface utilisateur avec les nouvelles données ici
                
            } catch (e) {
                alert('Erreur lors de l\'analyse du fichier JSON: ' + e);
            }
        };

        // Lire le fichier en tant que texte
        reader.readAsText(file);
    }
}

// Assurez-vous que votre input d'importation peut gérer les événements de changement de fichier
var importInput = document.createElement('input');
importInput.type = 'file';
importInput.style.display = 'none';
importInput.accept = '.json'; // Spécifiez les types de fichiers acceptés (optionnel)
importInput.onchange = importData;
document.body.appendChild(importInput);

document.getElementById('importButton').addEventListener('click', function() {
    importInput.click(); // Simuler un clic sur l'input caché à chaque fois que le bouton est cliqué
});

});


