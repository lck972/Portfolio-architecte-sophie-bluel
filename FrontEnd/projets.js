// Charger les projets depuis l'API et les ajouter à la galerie
(async () => {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      if (!response.ok) {
        throw new Error('La requête n\'a pas abouti : ' + response.status);
      }
      const projets = await response.json();
      
      const portfolio = document.getElementById('portfolio');
      const gallery = document.createElement('div');
      gallery.classList.add('gallery');

      // Créer un ensemble pour stocker les noms de projets uniques
    let nomsProjets = new Set();

    // Fonction pour afficher les projets filtrés
    function afficherProjets(nom) {
      // Effacer le contenu précédent de la galerie
      gallery.innerHTML = '';
      
      projets.forEach(projet => {
        if (nom === "Tous" || projet.category.name === nom) {
          const figureProjet = document.createElement('figure');
          const image = document.createElement('img');
          const figcaption = document.createElement('figcaption');
          
        image.src = projet.imageUrl; // Supposons que votre objet projet contient une propriété 'image' avec l'URL de l'image
        figcaption.textContent = projet.title; // Supposons que votre objet projet contient une propriété 'titre'
        
        figureProjet.appendChild(image);
        figureProjet.appendChild(figcaption);
        
        gallery.appendChild(figureProjet);

    // Ajouter le nom du projet à l'ensemble des noms de projets
    nomsProjets.add(projet.title);
        }
      });
    }
   // Créer les boutons de filtre
   const boutonFiltre = document.createElement("div");
   boutonFiltre.classList.add("filtre");

   const boutonTous = document.createElement("button");
   boutonTous.textContent = "Tous";
   boutonTous.addEventListener("click", () => {
    afficherProjets("Tous");
  });

   const boutonObjets = document.createElement("button");
   boutonObjets.textContent = "Objets";
   boutonObjets.addEventListener("click", () => {
    afficherProjets("Objets");
  });

   const boutonAppartement = document.createElement("button");
   boutonAppartement.textContent = "Appartements";
   boutonAppartement.addEventListener("click", () => {
    afficherProjets("Appartements");
  });

   const boutonHotelsRestaurants = document.createElement("button");
   boutonHotelsRestaurants.textContent = "Hotels & restaurants";
   boutonHotelsRestaurants.addEventListener("click", () => {
    afficherProjets("Hotels & restaurants");
  });

   boutonFiltre.appendChild(boutonTous);
   boutonFiltre.appendChild(boutonObjets);
   boutonFiltre.appendChild(boutonAppartement);
   boutonFiltre.appendChild(boutonHotelsRestaurants);

    // Ajouter les boutons de filtre au portfolio
    portfolio.appendChild(boutonFiltre);

    // Ajouter la galerie au portfolio
    portfolio.appendChild(gallery);

    // Afficher tous les projets par défaut
    afficherProjets("Tous");
  } catch (error) {
    console.error('Une erreur est survenue lors de la récupération des projets:', error);
  }
})();
