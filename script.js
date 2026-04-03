document.addEventListener('DOMContentLoaded', () => {
  const cocktailButton = document.getElementById('getCocktailInfo');
  const cocktailContainer = document.getElementById('cocktail-output');
  const dndButton = document.getElementById('getCharacterButton');
  const dndContainer = document.getElementById('dnd-output');
  const weatherButton = document.getElementById('getWeather');
  const weatherContainer = document.getElementById('weather-output');
  const coffeeButton = document.getElementById('getCoffee');
  const coffeeContainer = document.getElementById('coffee-output');
  const lotrButton = document.getElementById('getLotRInfo');
  const lotrContainer = document.getElementById('lotr-output');
  const githubButton = document.getElementById('getGitHubUser');
  const githubContainer = document.getElementById('github-output');
  const pokemonButton = document.getElementById('getPokemonInfo');
  const pokemonContainer = document.getElementById('pokemon-output');
  const memeButton = document.getElementById('getMemeInfo');
  const memeContainer = document.getElementById('meme-output'); 

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

  async function getCharacter() {
    dndContainer.textContent = 'Loading...';
    try {

      const [alignmentRes, raceRes, classRes] = await Promise.all([
        fetch('https://www.dnd5eapi.co/api/2014/alignments'),
        fetch('https://www.dnd5eapi.co/api/2014/races'),
        fetch('https://www.dnd5eapi.co/api/2014/classes')
      ]);
      if (!alignmentRes.ok || !raceRes.ok || !classRes.ok) {
        throw new Error('One or more API calls failed.');
      }
      const [alignmentsData, racesData, classesData] = await Promise.all([
        alignmentRes.json(),
        raceRes.json(),
        classRes.json()
      ]);

      const randomAlignment =
        alignmentsData.results[Math.floor(Math.random() * alignmentsData.results.length)].name;
      const randomRace =
        racesData.results[Math.floor(Math.random() * racesData.results.length)].name;
      const randomClass =
        classesData.results[Math.floor(Math.random() * classesData.results.length)].name;

      dndContainer.innerHTML = `
        <p><strong>Race:</strong> ${randomRace}</p>
        <p><strong>Class:</strong> ${randomClass}</p>
        <p><strong>Alignment:</strong> ${randomAlignment}</p>
      `;
    } catch (error) {
      console.error('Error fetching D&D character data:', error);
      dndContainer.textContent = 'Failed to load D&D data ☹️';
    }
  }

  async function getWeather() {
    weatherContainer.textContent = 'Loading...';
    try {
      const params = new URLSearchParams({
        latitude: 45.5234,
        longitude: -122.6762,
        hourly: "temperature_2m,rain,visibility",
        temperature_unit: "fahrenheit",
      });
      const url = `https://api.open-meteo.com/v1/forecast?${params}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const hourly = data.hourly;
      let weatherHTML = `
        <h3>Weather for Portland, OR</h3>
        <p><strong>Latitude:</strong> ${data.latitude}°N</p>
        <p><strong>Longitude:</strong> ${data.longitude}°E</p>
        <h4>Next 12 Hours:</h4>
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <tr>
            <th>Time</th>
            <th>Temperature (°C)</th>
            <th>Rain (mm)</th>
          </tr>
      `;

      for (let i = 0; i < Math.min(12, hourly.time.length); i++) {
        const time = new Date(hourly.time[i]).toLocaleTimeString();
        const temp = hourly.temperature_2m[i];
        const rain = hourly.rain[i];
        weatherHTML += `
          <tr>
            <td>${time}</td>
            <td>${temp}°F</td>
            <td>${rain}mm</td>
          </tr>
        `;
      }
      weatherHTML += '</table>';

      weatherContainer.innerHTML = weatherHTML;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      weatherContainer.textContent = 'Failed to load weather data ☹️';
    }
  }

  async function getCoffeeInfo() {
    coffeeContainer.textContent = 'Loading...';
    try {
      const response = await fetch(`https://coffee.alexflipnote.dev/random.json`);
      const data = await response.json();

      coffeeContainer.innerHTML = `<h3>Here's your random coffee! ☕</h3>`;

      const img = document.createElement('img');
      img.src = data.file;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      coffeeContainer.appendChild(img);
    }
    catch (error) {
      console.error('Error fetching coffee data:', error);
      coffeeContainer.textContent = 'Failed to load coffee data ☹️';
    }
  }

  async function getLotRInfo() {
    lotrContainer.textContent = 'Loading...';
    try {
      const apiKey = 'b5_jY6rRADyjxa5K41Wr';
      const response = await fetch('https://the-one-api.dev/v2/quotes/random/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const quote = await response.json();
      
      if (!quote.dialog) {
        throw new Error('No quote data received from API');
      }

      lotrContainer.innerHTML = `
        <h3>Your Lord of the Rings Quote</h3>
        <blockquote>
          <p>"${quote.dialog}"</p>
        </blockquote>
      `;
    } catch (error) {
      console.error('Error fetching LotR quote:', error);
      lotrContainer.textContent = 'Failed to load quote ☹️';
    }
  }

  async function getGitHubUser() {
    githubContainer.textContent = 'Loading...';
    try {
      const users = ['octocat', 'torvalds', 'gvanrossum', 'brendaneich', 'yyx990803'];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const response = await fetch(`https://api.github.com/users/${randomUser}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      githubContainer.innerHTML = `
        <h3>GitHub User: ${data.login}</h3>
        <p><strong>Name:</strong> ${data.name || 'N/A'}</p>
        <p><strong>Public Repositories:</strong> ${data.public_repos}</p>
        <p><strong>Followers:</strong> ${data.followers}</p>
      `;
    } catch (error) {
      console.error('Error fetching GitHub user data:', error);
      githubContainer.textContent = 'Failed to load GitHub user data ☹️';
    }
  }

  async function getPokemonInfo() {
    pokemonContainer.textContent = 'Loading...';
    try {
      const randomPokemonId = Math.floor(Math.random() * 898) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      pokemonContainer.innerHTML = `
        <h3>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h3>
        <img src="${data.sprites.front_default}" alt="${data.name}" />
        <p><strong>Height:</strong> ${data.height}</p>
        <p><strong>Weight:</strong> ${data.weight}</p>
      `;
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
      pokemonContainer.textContent = 'Failed to load Pokémon data ☹️';
    }
  }

  async function getMemeInfo() {
    memeContainer.textContent = 'Loading...';
    try {
      const response = await fetch('https://api.imgflip.com/get_memes');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (!data.data || data.data.memes.length === 0) {
        throw new Error('No meme data received from API');
      }

      const randomMeme = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];
      memeContainer.innerHTML = `
        <h3>Your Random Meme</h3>
        <img src="${randomMeme.url}" alt="Random Meme" />
      `;
    } catch (error) {
      console.error('Error fetching meme data:', error);
      memeContainer.textContent = 'Failed to load meme data ☹️';
    }
  }

  cocktailButton.addEventListener('click', getCocktailInfo);
  dndButton.addEventListener('click', getCharacter);
  weatherButton.addEventListener('click', getWeather);
  coffeeButton.addEventListener('click', getCoffeeInfo);
  lotrButton.addEventListener('click', getLotRInfo);
  githubButton.addEventListener('click', getGitHubUser);
  pokemonButton.addEventListener('click', getPokemonInfo);
  memeButton.addEventListener('click', getMemeInfo);

});

