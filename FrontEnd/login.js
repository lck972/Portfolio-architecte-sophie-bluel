// Création d'un conteneur pour le formulaire
const connexion = document.createElement('div');
connexion.classList.add('connexion');

// Création du titre "Log In" (h2)
const loginTitle = document.createElement('h2');
loginTitle.textContent = 'Log In';

// Création du formulaire
const form = document.createElement('form');
form.classList.add('identifiant');

// Création du champ Email
const emailLabel = document.createElement('label');
emailLabel.textContent = 'Email';
const emailInput = document.createElement('input');
emailInput.type = 'email';
emailInput.name = 'email';
emailInput.required = true;

// Création du champ Mot de passe
const passwordLabel = document.createElement('label');
passwordLabel.textContent = 'Mot de passe';
const passwordInput = document.createElement('input');
passwordInput.type = 'password';
passwordInput.name = 'password';
passwordInput.required = true;

// Création du bouton de soumission
const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = 'Se connecter';

// Création du lien "Mot de passe oublié"
const forgotPasswordLink = document.createElement('a');
forgotPasswordLink.textContent = 'Mot de passe oublié';
forgotPasswordLink.href = '#'; // Mettez ici l'URL de la page de réinitialisation de mot de passe

// Ajout des éléments au formulaire
form.appendChild(emailLabel);
form.appendChild(emailInput);
form.appendChild(passwordLabel);
form.appendChild(passwordInput);
form.appendChild(submitButton);
form.appendChild(forgotPasswordLink); // Ajout du lien "Mot de passe oublié"

// Ajout du titre et du formulaire à la div "connexion"
connexion.appendChild(loginTitle);
connexion.appendChild(form);

// Ajout de la div "connexion" à la balise <main>
const main = document.querySelector('main');
main.appendChild(connexion);

// Création d'un paragraphe pour le message d'erreur
const errorMessageElement = document.createElement('p');
errorMessageElement.id = 'errorMessage';
// Ajout du paragraphe de message d'erreur à la div "connexion"
connexion.appendChild(errorMessageElement);

document.querySelector('.identifiant').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const formData = new FormData(this);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Les informations utilisateur/mot de passe ne sont pas correctes');
        }

        const data = await response.json();
        console.log(data)
        // Connexion réussie, rediriger vers la page d'accueil
        window.localStorage.setItem('sb-auth', data.token)
        window.location.href = './index.html';
    } catch (error) {
        // Afficher un message d'erreur
        const errorMessageElement = document.getElementById('errorMessage');
        errorMessageElement.innerText = error.message; 
        errorMessageElement.style.display = 'flex';
    }
});



  