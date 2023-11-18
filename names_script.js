document.addEventListener('DOMContentLoaded', function () {
    // Récupérer la liste des noms depuis le stockage local
    let names = JSON.parse(localStorage.getItem('names')) || [];

    // Mettre à jour l'affichage initial
    updateNameList();

    // Ajouter un événement pour gérer l'ajout de noms
    document.getElementById('nameInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            addName();
        }
    });

    function showNotification(message, type) {
        const notificationContainer = document.getElementById("notificationContainer");

        // Créer un nouvel élément de notification
        const newNotification = document.createElement("div");
        newNotification.classList.add("alert", `alert-${type}`, "alert-dismissible", "fade", "show");
        newNotification.setAttribute("role", "alert");

        // Ajouter le contenu de la notification
        newNotification.innerHTML = `
            <span>${message}</span>
            <button type="button" class="btn-close" aria-label="Close" onclick="hideNotification(this)"></button>
        `;

        // Ajouter la notification au conteneur
        notificationContainer.appendChild(newNotification);

        // Disparition de la notification après 3 secondes (3000 millisecondes)
        setTimeout(() => {
            hideNotification(newNotification);
        }, 3000);
    }

    function hideNotification(notification) {
        if (!notification) {
            notification = document.querySelector("#notificationContainer .alert");
        }

        // Cacher la notification en retirant la classe "show"
        notification.classList.remove("show");

        // Supprimer la notification après l'animation de disparition
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    // Fonction pour ajouter un nom à la liste
    function addName() {
        let inputElement = document.getElementById('nameInput');
        let name = inputElement.value.trim();

        if (name !== '') {
            // Vérifier si le nom existe déjà
            if (names.includes(name)) {
                showNotification('Le nom existe déjà.', 'danger');
                inputElement.value = ''; // Effacer le champ de saisie
            } else {
                // Ajouter le nom à la liste
                names.push(name);

                // Trier la liste par ordre alphabétique
                names.sort();

                // Mettre à jour le stockage local
                localStorage.setItem('names', JSON.stringify(names));

                // Mettre à jour l'affichage
                updateNameList();

                // Effacer le champ de saisie
                inputElement.value = '';
            }
        }
    }

    // Ajouter un événement pour gérer la suppression de noms
    document.getElementById('nameList').addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-icon')) {
            // Récupérer le nom associé à l'icône de suppression
            let nameToDelete = event.target.dataset.name;

            // Supprimer le nom de la liste
            names = names.filter(function (name) {
                return name !== nameToDelete;
            });

            // Mettre à jour le stockage local
            localStorage.setItem('names', JSON.stringify(names));

            // Mettre à jour l'affichage
            updateNameList();
        }
    });

    // Fonction pour mettre à jour l'affichage de la liste des noms
    function updateNameList() {
        let listElement = document.getElementById('nameList');
        listElement.innerHTML = ''; // Effacer la liste actuelle

        // Ajouter chaque nom à la liste
        names.forEach(function (name) {
            let listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.textContent = name;

            // Ajouter l'icône de suppression
            let deleteIcon = document.createElement('span');
            deleteIcon.className = 'badge bg-danger rounded-pill delete-icon';
            deleteIcon.innerHTML = '&times;'; // Utiliser le caractère "×" comme croix rouge
            deleteIcon.setAttribute('data-name', name);
            listItem.appendChild(deleteIcon);

            listElement.appendChild(listItem);
        });
    }
});
