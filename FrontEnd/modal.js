// Sélectionner le lien "Modifier" et la modal
const lienModifier = document.getElementById('modifier');
const modal = document.getElementById('modal');

// Ajouter un gestionnaire d'événements pour le clic sur le lien "Modifier"
lienModifier.addEventListener('click', function(event) {
    // Empêcher le comportement par défaut du lien
    event.preventDefault();
    
    // Afficher la modal
    modal.style.display = 'block';
});


async function chargerPhotos() {
    try {
        const response = await fetch('http://localhost:5678/api/works')
    if (!response.ok) {
      throw new Error("La requête n'a pas abouti : " + response.status)
    }
    const photos = await response.json();

    const photoContainer = document.querySelector('.photo');

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
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4'; // Remplacez VOTRE_TOKEN_AUTH par votre jeton d'authentification
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

// Sélectionner l'icône de fermeture et la modale
const closeModalIcon = document.getElementById('closeModal');

// Ajouter un gestionnaire d'événements pour fermer la modale en cliquant sur l'icône de fermeture
closeModalIcon.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Ajouter un gestionnaire d'événements pour fermer la modale en cliquant à l'extérieur de la modale
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});