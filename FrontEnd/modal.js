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
        const token = window.localStorage.getItem('sb-auth'); 
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
const closeModalIcon = document.querySelectorAll('.fa-xmark');

// Ajouter un gestionnaire d'événements pour fermer la modal en cliquant sur l'icône de fermeture
closeModalIcon.forEach(icon => {
    icon.addEventListener('click', function() {
        modal.style.display = 'none';
    });
   /* 
   // Réinitialiser le contenu de la modal à sa valeur initiale
    modal.innerHTML = contenuInitialModal;*/
});

// Ajouter un gestionnaire d'événements pour fermer la modal en cliquant à l'extérieur de la modal
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        
        // Réinitialiser le contenu de la modal à sa valeur initiale
        modal.innerHTML = contenuInitialModal;
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const modalContent = document.querySelector('.modal-content');
    const modalContent2 = document.querySelector('.modal-content2');
    const ajoutButton = document.querySelector('.ajout');
    const backArrow = document.querySelector('.fa-arrow-left');
    // État initial : masquer modalContent2
    modalContent2.style.display = 'none';

    // Fonction pour afficher modalContent2 et masquer modalContent
    function showModalContent2() {
        modalContent.style.display = 'none';
        modalContent2.style.display = 'flex';
    }

    // Fonction pour afficher modalContent et masquer modalContent2
    function showmodalContent() {
        modalContent2.style.display = 'none';
        modalContent.style.display = 'block';
    }

    // Événement pour le clic sur le bouton ajout
    ajoutButton.addEventListener('click', showModalContent2);

    // Événement pour le clic sur la flèche retour
    backArrow.addEventListener('click', showmodalContent);
});


const cadreDiv = document.querySelector('.cadre');
document.querySelector('.ajout-photo').addEventListener('click', function(event) {
    // Créer un input de type file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    // Fonction pour gérer le changement de fichier
    input.addEventListener('change', function(event) {
        const file = event.target.files[0]; // obtenir le premier fichier sélectionné
        if (file) {
            // Créer un objet URL pour l'aperçu de l'image
            const reader = new FileReader();
            reader.onload = function(e) {
                // Créer un élément img pour afficher l'aperçu
                const imgPreview = document.createElement('img');
                imgPreview.src = e.target.result;
                imgPreview.style.maxWidth = '100%';
                imgPreview.style.maxHeight = '200px'; // limiter la taille de l'aperçu

                // Supprimer les éléments existants dans la div .cadre
                cadreDiv.innerHTML = '';

                // Ajouter l'aperçu à la div .cadre
                cadreDiv.appendChild(imgPreview);
            };
            // Lire le fichier en tant que URL de données
            reader.readAsDataURL(file);
        }
    });

    // Cliquez sur le bouton d'ouverture de fichier
    input.click();

    // Récupérer le select pour la catégorie
    const select = document.getElementById('categorie');

    // Récupérer les catégories depuis l'API et les ajouter en tant qu'options au select
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(data => {
            // Effacer les options précédentes
            select.innerHTML = '';

            // Ajouter une option par défaut
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
           // defaultOption.textContent = 'Choisir une catégorie';
            select.appendChild(defaultOption);

            // Ajouter chaque catégorie en tant qu'option au select
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories depuis l\'API :', error));

});

document.addEventListener("DOMContentLoaded", function() {
    const cadreDiv = document.querySelector('.cadre');
    const titreInput = document.getElementById('titre');
    const selectCategorie = document.getElementById('categorie');
    const validerButton = document.querySelector('.valider');

    // Fonction pour vérifier les conditions et modifier le style du bouton de validation si nécessaire
    function verifierEtStyliserValider() {
        // Vérifier si la classe cadre contient un fichier image
        const aDesFichiersImage = cadreDiv.querySelector('img') !== null;

        // Vérifier si l'input titre a un élément à l'intérieur
        const aTitre = titreInput.value.trim() !== '';

        // Vérifier si le select a un élément sélectionné
        const aCategorieSelectionnee = selectCategorie.value !== '';

        // Si toutes les conditions sont remplies, modifier le style du bouton de validation pour qu'il ressemble à un simple bouton
        if (aDesFichiersImage && aTitre && aCategorieSelectionnee) {
            validerButton.classList.remove('valider'); // Supprimer la classe 'valider'
            validerButton.classList.add('simple-bouton'); // Ajouter une classe pour un style de bouton simple
            validerButton.textContent = 'Valider'; // Changer le texte du bouton
        } else {
            // Si les conditions ne sont pas remplies, restaurer le style du bouton de validation
            validerButton.classList.remove('simple-bouton');
            validerButton.classList.add('valider');
            validerButton.textContent = 'Valider';
        }
    }

    // Ajouter des écouteurs d'événements pour les changements pertinents
    cadreDiv.addEventListener('change', verifierEtStyliserValider);
    titreInput.addEventListener('input', verifierEtStyliserValider);
    selectCategorie.addEventListener('change', verifierEtStyliserValider);

    // Appeler la fonction au chargement initial de la page pour mettre à jour le style du bouton de validation
    verifierEtStyliserValider();

    // Ajout d'un écouteur d'événements à un élément parent pour écouter les clics sur les boutons simples
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('simple-bouton')) {
            async function envoyerPhoto() {
                try {
                     
                    const titre = document.getElementById('titre').value;
                    const categorie = document.getElementById('categorie').value;
                    const imgSrc = document.querySelector('.cadre img').src;
            
                    // Vérifier si tous les champs sont remplis
                    if (!titre || !categorie || !imgSrc) {
                        throw new Error("Veuillez remplir tous les champs.");
                    }
            
                    // Créer un objet FormData
                    const formData = new FormData();
                    formData.append('title', titre);
                    formData.append('categoryId', categorie);
                    formData.append('imageUrl', imgSrc);
            
                    // Envoyer les données via une requête POST
                    const token = window.localStorage.getItem('sb-auth');
                    const response = await fetch('http://localhost:5678/api/works', {
                        method: 'POST',
                        body: formData, // Utilisation de FormData comme corps de la requête
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
            
                    if (!response.ok) {
                        throw new Error("La requête POST n'a pas abouti : " + response.status);
                    }
            
                    // Rafraîchir la liste des photos après l'ajout
                    chargerPhotos();
            
                    // Fermer la modal
                    modal.style.display = 'none';
            
                    // Réinitialiser le contenu de la modal à sa valeur initiale
                    modal.innerHTML = contenuInitialModal;
                } catch (error) {
                    console.error('Une erreur est survenue lors de l\'envoi des données à l\'API :', error);
                }
            }
            envoyerPhoto();
        }
    });
});

/*async function envoyerPhoto() {
    try {
        const titre = document.getElementById('titre').value;
        const categorie = document.getElementById('categorie').value;
        const imgSrc = document.querySelector('.cadre img').src;

        // Vérifier si tous les champs sont remplis
        if (!titre || !categorie || !imgSrc) {
            throw new Error("Veuillez remplir tous les champs.");
        }

        // Créer un objet FormData
        const formData = new FormData();
        formData.append('title', titre);
        formData.append('categoryId', categorie);
        formData.append('imageUrl', imgSrc);

        // Envoyer les données via une requête POST
        const token = window.localStorage.getItem('sb-auth'); 
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData, // Utilisation de FormData comme corps de la requête
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("La requête POST n'a pas abouti : " + response.status);
        }

        // Rafraîchir la liste des photos après l'ajout
        chargerPhotos();

        // Fermer la modal
        modal.style.display = 'none';

        // Réinitialiser le contenu de la modal à sa valeur initiale
        modal.innerHTML = contenuInitialModal;
    } catch (error) {
        console.error('Une erreur est survenue lors de l\'envoi des données à l\'API :', error);
    }
}*/
