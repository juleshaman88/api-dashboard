document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    cocktail: { button: document.getElementById('getCocktailInfo'), container: document.getElementById('cocktail-output') },
    dnd: { button: document.getElementById('getCharacterButton'), container: document.getElementById('dnd-output') },
    weather: { button: document.getElementById('getWeather'), container: document.getElementById('weather-output') },
    currency: { button: document.getElementById('getCurrencyRates'), container: document.getElementById('currency-output') },
    lotr: { button: document.getElementById('getLotRInfo'), container: document.getElementById('lotr-output') },
    github: { button: document.getElementById('getGitHubUser'), container: document.getElementById('github-output') },
    pokemon: { button: document.getElementById('getPokemonInfo'), container: document.getElementById('pokemon-output') },
    meme: { button: document.getElementById('getMemeInfo'), container: document.getElementById('meme-output') },
    clearAll: document.getElementById('clearAll')
  };

  const setLoading = (container) => { container.textContent = 'Loading...'; };
  const setError = (container, message) => { container.textContent = `Failed to load ${message} ☹️`; };

  async function getCocktailInfo() {
    setLoading(elements.cocktail.container);
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

      elements.cocktail.container.innerHTML = `
        <h3>${drink.strDrink}</h3>
        <ul>${ingredients.map(item => `<li>${item}</li>`).join('')}</ul>
        <p><strong>Glass:</strong> ${drink.strGlass}</p>
        <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
      `;
    } catch (error) {
      console.error('Error fetching cocktail info:', error);
      setError(elements.cocktail.container, 'cocktail info');
    }
  }

  async function getCharacter() {
    setLoading(elements.dnd.container);
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

      const randomAlignment = alignmentsData.results[Math.floor(Math.random() * alignmentsData.results.length)].name;
      const randomRace = racesData.results[Math.floor(Math.random() * racesData.results.length)].name;
      const randomClass = classesData.results[Math.floor(Math.random() * classesData.results.length)].name;

      elements.dnd.container.innerHTML = `
        <p><strong>Race:</strong> ${randomRace}</p>
        <p><strong>Class:</strong> ${randomClass}</p>
        <p><strong>Alignment:</strong> ${randomAlignment}</p>
      `;
    } catch (error) {
      console.error('Error fetching D&D character data:', error);
      setError(elements.dnd.container, 'D&D data');
    }
  }

  async function getWeather() {
    setLoading(elements.weather.container);
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
          <tr><th>Time</th><th>Temperature (°F)</th><th>Rain (mm)</th></tr>
      `;

      for (let i = 0; i < Math.min(12, hourly.time.length); i++) {
        const time = new Date(hourly.time[i]).toLocaleTimeString();
        const temp = hourly.temperature_2m[i];
        const rain = hourly.rain[i];
        weatherHTML += `<tr><td>${time}</td><td>${temp}°F</td><td>${rain}mm</td></tr>`;
      }
      weatherHTML += '</table>';

      elements.weather.container.innerHTML = weatherHTML;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(elements.weather.container, 'weather data');
    }
  }

  async function getCurrencyRates() {
    setLoading(elements.currency.container);
    try {
      const apiKey = '53d8d2003b313b5ef0612f7d53fbf74f';
      const response = await fetch(`https://data.fixer.io/api/latest?access_key=${apiKey}`);
      const data = await response.json();

      const selectedCurrencies = ['USD', 'EUR', 'JPY', 'KRW', 'NOK'];
      const rates = data.rates;
      let ratesHTML = '<h3>Currency Exchange Rates</h3><ul>';

      for (const currency of selectedCurrencies) {
        if (rates[currency]) {
          ratesHTML += `<li><strong>${currency}:</strong> ${rates[currency]}</li>`;
        }
      }
      ratesHTML += '</ul>';

      elements.currency.container.innerHTML = ratesHTML;
    } catch (error) {
      console.error('Error fetching currency data:', error);
      setError(elements.currency.container, 'currency data');
    }
  }

  async function getLotRInfo() {
    setLoading(elements.lotr.container);
    try {
      const apiKey = 'b5_jY6rRADyjxa5K41Wr';
      const response = await fetch('https://the-one-api.dev/v2/quotes/random/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const quote = await response.json();

      if (!quote.dialog) throw new Error('No quote data received from API');

      elements.lotr.container.innerHTML = `
        <h3>Your Lord of the Rings Quote</h3>
        <blockquote><p>"${quote.dialog}"</p></blockquote>
      `;
    } catch (error) {
      console.error('Error fetching LotR quote:', error);
      setError(elements.lotr.container, 'quote');
    }
  }

  async function getGitHubUser() {
    setLoading(elements.github.container);
    try {
      const users = ['octocat', 'torvalds', 'gvanrossum', 'brendaneich', 'yyx990803'];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const response = await fetch(`https://api.github.com/users/${randomUser}`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      elements.github.container.innerHTML = `
        <h3>GitHub User: ${data.login}</h3>
        <p><strong>Name:</strong> ${data.name || 'N/A'}</p>
        <p><strong>Public Repositories:</strong> ${data.public_repos}</p>
        <p><strong>Followers:</strong> ${data.followers}</p>
      `;
    } catch (error) {
      console.error('Error fetching GitHub user data:', error);
      setError(elements.github.container, 'GitHub user data');
    }
  }

  async function getPokemonInfo() {
    setLoading(elements.pokemon.container);
    try {
      const randomPokemonId = Math.floor(Math.random() * 898) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
      elements.pokemon.container.innerHTML = `
        <h3>${name}</h3>
        <img src="${data.sprites.front_default}" alt="${data.name}" />
        <p><strong>Height:</strong> ${data.height}</p>
        <p><strong>Weight:</strong> ${data.weight}</p>
      `;
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
      setError(elements.pokemon.container, 'Pokémon data');
    }
  }

  async function getMemeInfo() {
    setLoading(elements.meme.container);
    try {
      const response = await fetch('https://api.imgflip.com/get_memes');

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (!data.data || data.data.memes.length === 0) {
        throw new Error('No meme data received from API');
      }

      const randomMeme = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];
      elements.meme.container.innerHTML = `
        <h3>Your Random Meme</h3>
        <img src="${randomMeme.url}" alt="Random Meme" />
      `;
    } catch (error) {
      console.error('Error fetching meme data:', error);
      setError(elements.meme.container, 'meme data');
    }
  }

  function clearAllOutputs() {
    Object.values(elements).forEach(el => {
      if (el.container) el.container.textContent = '';
    });
  }

  elements.cocktail.button.addEventListener('click', getCocktailInfo);
  elements.dnd.button.addEventListener('click', getCharacter);
  elements.weather.button.addEventListener('click', getWeather);
  elements.currency.button.addEventListener('click', getCurrencyRates);
  elements.lotr.button.addEventListener('click', getLotRInfo);
  elements.github.button.addEventListener('click', getGitHubUser);
  elements.pokemon.button.addEventListener('click', getPokemonInfo);
  elements.meme.button.addEventListener('click', getMemeInfo);
  elements.clearAll.addEventListener('click', clearAllOutputs);

});

