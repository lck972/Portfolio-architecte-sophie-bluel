// Sélectionner le lien "Modifier" et la modal
const lienModifier = document.getElementById('modifier');
const modal = document.getElementById('modal');

// Ajouter un gestionnaire d'événements pour le clic sur le lien "Modifier"
lienModifier.addEventListener('click', function(event) {
    // Empêcher le comportement par défaut du lien
    event.preventDefault();
    
    // Afficher la modal
    modal.style.display = 'block';

    // Enregistrer le contenu initial de la modal
    contenuInitialModal = modal.innerHTML;
});

// Charger les photos au chargement de la page
async function chargerPhotos() {
    try {
        const response = await fetch('http://localhost:5678/api/works')
        if (!response.ok) {
            throw new Error("La requête n'a pas abouti : " + response.status)
        }
        const photos = await response.json();

        const photoContainer = document.querySelector('.photo');

        // Effacer le contenu existant du conteneur de photos
        photoContainer.innerHTML = '';

        // Afficher les photos et les boutons de suppression
        photos.forEach(photo => {
            const photoElement = document.createElement('div');
            photoElement.innerHTML = `
                <img src="${photo.imageUrl}" alt="Photo">
                <i class="fa-solid fa-trash-can" onclick="supprimerPhoto('${photo.id}')"></i>
            `;
            photoElement.classList.add('photoElement')
            photoContainer.appendChild(photoElement);
        });
    } catch (error) {
        console.error('Une erreur est survenue lors de la récupération des photos :', error);
    }
}

// Fonction pour supprimer une photo
async function supprimerPhoto(photoId) {
    try {
        // Envoyer une requête DELETE à l'API pour supprimer la photo, avec le token d'authentification inclus
        const token = window.localStorage.getItem('sb-auth'); // Remplacez VOTRE_TOKEN_AUTH par votre jeton d'authentification
        const response = await fetch(`http://localhost:5678/api/works/${photoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("La requête DELETE n'a pas abouti : " + response.status);
        }

        // Mettre à jour l'interface utilisateur en retirant la photo supprimée
        const photoElement = document.querySelector(`#photos div[data-photo-id="${photoId}"]`);
        if (photoElement) {
            photoElement.remove();
        } else {
            console.warn('La photo à supprimer n\'a pas été trouvée dans l\'interface utilisateur.');
        }
    } catch (error) {
        console.error('Une erreur est survenue lors de la suppression de la photo :', error);
    }
}

// Charger les photos au chargement de la page
window.addEventListener('load', chargerPhotos);

// Sélectionner l'icône de fermeture et la modal
const closeModalIcon = document.getElementById('closeModal');

// Ajouter un gestionnaire d'événements pour fermer la modal en cliquant sur l'icône de fermeture
closeModalIcon.addEventListener('click', function() {
    modal.style.display = 'none';
    
    // Réinitialiser le contenu de la modal à sa valeur initiale
    modal.innerHTML = contenuInitialModal;
});

// Ajouter un gestionnaire d'événements pour fermer la modal en cliquant à l'extérieur de la modal
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        
        // Réinitialiser le contenu de la modal à sa valeur initiale
        modal.innerHTML = contenuInitialModal;
    }
});

// Ajouter un gestionnaire d'événements pour le clic sur le bouton "Ajouter photo"
document.querySelector('.ajout').addEventListener('click', function() {
    // Sauvegarde de l'état initial de la modal
    const modalContentDiv = document.querySelector('.modal-content');
    const originalModalHTML = modalContentDiv.innerHTML;

    // Ajout de la classe modifModal-content
    modalContentDiv.classList.remove('modal-content');
    modalContentDiv.classList.add('modifModal-content');

    // Ajout de l'icône fa-arrow-left dans la modifModal-content
    let iconHTML = '<i class="fa-solid fa-arrow-left"></i>';
    modalContentDiv.insertAdjacentHTML('afterbegin', iconHTML);

    // Gestionnaire d'événements pour l'icône fa-arrow-left
    let arrowLeftIcon = document.querySelector('.fa-arrow-left');
    arrowLeftIcon.addEventListener('click', function() {
        // Restaurer l'état initial de la modal
        modalContentDiv.classList.remove('modifModal-content');
        modalContentDiv.classList.add('modal-content');
        modalContentDiv.innerHTML = originalModalHTML;
console.log(arrowLeftIcon)
        // Supprimer l'icône fa-arrow-left
        arrowLeftIcon.parentNode.removeChild(arrowLeftIcon);
    });

    // Reste du code pour le bouton "Ajouter photo"
    document.querySelector('#modal h2').innerText = "Ajout photo";
    let photoDiv = document.querySelector('.photo');
    photoDiv.classList.remove('photo');
    photoDiv.classList.add('modifPhoto');
    photoDiv.innerHTML = '<div class="cadre"><i class="fa-regular fa-image"></i><button class="ajout-photo">+ Ajouter photo</button><p>jpg, png : 4mo max.</p></div>';
    let formHTML = '<form><label for="titre">Titre:</label><input type="text" id="titre" name="titre"><br><label for="categorie">Catégorie:</label><input type="text" id="categorie" name="categorie"><i class="fa-solid fa-chevron-down"></i><br></form>';
    photoDiv.insertAdjacentHTML('beforeend', formHTML);
    let ajoutButton = document.querySelector('.ajout');
    ajoutButton.innerText = "Valider";
    console.log("click ajout")
    ajoutButton.classList.remove('ajout');
    ajoutButton.setAttribute('id', 'valider');

    document.querySelector('#valider').addEventListener('click', function() {
        // Action à effectuer lors du clic sur le bouton "Valider"
   });
});

