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
let formHTML = '<form><label for="titre">Titre:</label><input type="text" id="titre" name="titre" required><br><label for="categorie">Catégorie:</label><select id="categorie" name="categorie" required></select><br></form>';
photoDiv.insertAdjacentHTML('beforeend', formHTML);
let ajoutButton = document.querySelector('.ajout');
ajoutButton.innerText = "Valider";
console.log("click ajout")
ajoutButton.classList.remove('ajout');
ajoutButton.setAttribute('id', 'valider');

const cadreDiv = document.querySelector('.cadre');

document.querySelector('.ajout-photo').addEventListener('click', function() {
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

    // Fonction pour vérifier si l'input, le select et le cadre div sont remplis
function checkFields() {
    console.log("Fonction checkFields() appelée."); // Ajout
    const inputTitre = document.getElementById('titre');
    const select = document.getElementById('categorie'); // Ajout
    const cadreImg = document.querySelector('.cadre img');
    const validerButton = document.getElementById('valider');

    console.log("Vérification des champs :");
    console.log("Input titre:", inputTitre.value);
    console.log("Select:", select.value);
    console.log("Cadre image:", cadreImg);

    if (inputTitre.value && select.value && cadreImg) {
        console.log("Tous les champs sont remplis !");
        // Si l'input, le select et le cadre div sont remplis, activer le bouton Valider
        validerButton.removeAttribute('disabled');
        validerButton.removeAttribute('valider'); // Supprimer la classe 'valider'
        validerButton.classList.add('button'); // Ajouter la classe 'button'
        console.log("Changement de classe en button du bouton effectué."); // Ajout
    } else {
        console.log("Certains champs ne sont pas remplis...");
        // Sinon, désactiver le bouton Valider
        validerButton.setAttribute('disabled', 'disabled');
        validerButton.classList.remove('button'); // Supprimer la classe 'button'
        validerButton.classList.add('valider'); // Ajouter la classe 'valider'
        console.log("Changement de classe du bouton effectué."); // Ajout
    }
}
    

    // Appeler checkFields() après le chargement initial de la page pour initialiser l'état du bouton Valider
    checkFields();

    // Ajouter un événement de changement à l'input et au select pour vérifier les champs à chaque modification
    const inputTitre = document.getElementById('titre');
    inputTitre.addEventListener('input', checkFields);
    select.addEventListener('change', checkFields);

    // Déclencher le clic sur l'input
    input.click();
});

});

/* // Ajouter le code pour envoyer les données à l'API ici
document.querySelector('.valider').addEventListener('click', async function() {
    try {
        const titre = document.getElementById('titre').value;
        const categorie = document.getElementById('categorie').value;
        const imgSrc = document.querySelector('.cadre img').src;

        // Vérifier si tous les champs sont remplis
        if (!titre || !categorie || !imgSrc) {
            throw new Error("Veuillez remplir tous les champs.");
        }

        // Créer un objet avec les données à envoyer à l'API
        const formData = {
            title: titre,
            category: categorie,
            image: imgSrc
        };

        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
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
});
 */