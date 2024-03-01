// Charger les projets depuis l'API et les ajouter à la galerie

;(async () => {
  const token = window.localStorage.getItem ('sb-auth')
  try {
    const response = await fetch('http://localhost:5678/api/works')
    if (!response.ok) {
      throw new Error("La requête n'a pas abouti : " + response.status)
    }
    const projets = await response.json()

    const portfolio = document.getElementById('portfolio')
    const gallery = document.createElement('div')
    gallery.classList.add('gallery')

    // Créer un ensemble pour stocker les noms de projets uniques
    let nomsProjets = new Set()

    // Fonction pour afficher les projets filtrés
    function afficherProjets(nom) {
      // Effacer le contenu précédent de la galerie
      gallery.innerHTML = ''

      projets.forEach((projet) => {
        if (nom === 'Tous' || projet.category.name === nom) {
          const figureProjet = document.createElement('figure')
          const image = document.createElement('img')
          const figcaption = document.createElement('figcaption')

          image.src = projet.imageUrl // Supposons que votre objet projet contient une propriété 'image' avec l'URL de l'image
          figcaption.textContent = projet.title // Supposons que votre objet projet contient une propriété 'titre'

          figureProjet.appendChild(image)
          figureProjet.appendChild(figcaption)

          gallery.appendChild(figureProjet)

          // Ajouter le nom du projet à l'ensemble des noms de projets
          nomsProjets.add(projet.title)
        }
      })
    }

    
 
    // Ajouter la galerie au portfolio
    portfolio.appendChild(gallery)

    // Afficher tous les projets par défaut
    afficherProjets('Tous')
  } catch (error) {
    console.error(
      'Une erreur est survenue lors de la récupération des projets:',
      error
    )
  }
  // Créer les boutons de filtre

  async function getCategories() {
    const response = await fetch('http://localhost:5678/api/categories')
    if (!response.ok) {
      throw new Error("La requête n'a pas abouti : " + response.status)
    }
    const categories = await response.json()
    return categories
  }

  async function afficherCategorie() {
    const boutonFiltre = document.querySelector('.filtre')
    const categories = await getCategories()
    categories.unshift({name:'tous' })
    categories.forEach((categorie) => {
      const bouton = document.createElement('button')
      bouton.textContent = categorie.name
      if (token){
        bouton.classList.add('hidde')
      }
      bouton.addEventListener('click', () => {
        afficherProjets(categorie.name)
      })
      boutonFiltre.appendChild(bouton)
    })
  }
function modeAdmin() {
  const elementAdmin = document.querySelectorAll('[data-admin]')
  const menuLogin=document.querySelector('.login-button')
  let page='./index.html'
  
  if (token){
    Array.from(elementAdmin).forEach((node) => node.classList.remove('hidde'))
    menuLogin.innerHTML='logout'
    page = './index.html'  
  }
  else {
    Array.from(elementAdmin).forEach((node) => node.classList.add('hidde'))
    menuLogin.innerHTML='login'
    page='./login.html'
  }
  menuLogin.addEventListener('click', () => {
    localStorage.removeItem('sb-auth')
    window.location.href =page
  })
}

  afficherCategorie()
  modeAdmin()
})()



//afficherCategorie() 
//const zone_admin = document.querySelectorAll('[data-admin]')
//console.log(zone_admin)
//Array.from(zone_admin).foreach((node) => node.classList.add('hidde'))