// Création d'un conteneur pour le formulaire
const connexion = document.createElement('div');
connexion.classList.add('connexion');

// Création du titre "Log In" (h2)
const loginTitle = document.createElement('h2');
loginTitle.textContent = 'Log In';

// Création du formulaire
const form = document.createElement('form');

// Création du champ Email
const emailLabel = document.createElement('label');
emailLabel.textContent = 'Email:';
const emailInput = document.createElement('input');
emailInput.type = 'email';
emailInput.name = 'email';
emailInput.required = true;

// Création du champ Mot de passe
const passwordLabel = document.createElement('label');
passwordLabel.textContent = 'Mot de passe:';
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





