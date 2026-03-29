document.addEventListener('DOMContentLoaded', () => {
  const cocktailButton = document.getElementById('getCocktailInfo');
  const cocktailContainer = document.getElementById('cocktail-output');
  const dndButton = document.getElementById('getDndAlignments');
  const dndContainer = document.getElementById('dnd-output');

  async function getCocktailInfo() {
    cocktailContainer.textContent = 'Loading...';

    try {
      const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const drink = data.drinks[0];

      const ingredients = [];
      for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient) {
          ingredients.push(`${measure ? measure : ''} ${ingredient}`.trim());
        }
      }

      cocktailContainer.innerHTML = `
        <h3>${drink.strDrink}</h3>
        <ul>
          ${ingredients.map(item => `<li>${item}</li>`).join('')}
        </ul>
        <p><strong>Glass:</strong> ${drink.strGlass}</p>
        <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
      `;

    } catch (error) {
      console.error('Error fetching cocktail info:', error);
      cocktailContainer.textContent = 'Failed to load cocktail info ☹️';
    }
  }

  async function getAlignments() {
    dndContainer.textContent = 'Loading...';

    try {
      const response = await fetch('https://www.dnd5eapi.co/api/2014/alignments');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const alignment = data.results[randomIndex].name;

      dndContainer.innerHTML = `
        <p><strong>Alignment:</strong> ${alignment}</p>
      `;

    } catch (error) {
      console.error('Error fetching D&D alignments:', error);
      dndContainer.textContent = 'Failed to load D&D alignments ☹️';
    }
  }

  cocktailButton.addEventListener('click', getCocktailInfo);
  dndButton.addEventListener('click', getAlignments);
});

