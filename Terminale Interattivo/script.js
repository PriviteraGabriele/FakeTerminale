const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const inputLine = document.querySelector('.input-line');
const apiKey = 'cb7bdea4e23eebc003fec1a9c3b03c3d';


function printOutput(message) {
    const outputDiv = document.createElement('div');
    outputDiv.className = 'output-line';
    outputDiv.innerHTML = message;
    terminalOutput.appendChild(outputDiv);
    terminalOutput.appendChild(inputLine);
}

function getCurrentDateTime() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    printOutput(formattedDate);
}

function makeRequest(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => printOutput(data))
        .catch(error => printOutput(`Errore durante la richiesta: ${error}`));
}

function clearTerminal() {
    terminalOutput.innerHTML = '';
    terminalOutput.appendChild(inputLine);
}

async function getWeather(apiKey, city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Errore nella richiesta');
        }
        const data = await response.json();
        printWeatherInfo(data);
    } catch (error) {
        printOutput('Errore:', error);
    }
}

function printWeatherInfo(weatherData) {
    const location = weatherData.name;
    const country = weatherData.sys.country;
    const temperature = weatherData.main.temp;
    const weatherDescription = weatherData.weather[0].description;
    const windSpeed = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();

    printOutput(`Località: ${location}, ${country}`);
    printOutput(`Temperatura: ${temperature}°C`);
    printOutput(`Tempo: ${weatherDescription}`);
    printOutput(`Velocità del vento: ${windSpeed} m/s`);
    printOutput(`Umidità: ${humidity}%`);
    printOutput(`Alba: ${sunrise}`);
    printOutput(`Tramonto: ${sunset}`);
}

async function getMeal(url){
    fetch(url)
        .then(response => response.json())
        .then(data => printMealInfo(data))
        .catch(error => printOutput(`Errore durante la richiesta: ${error}`));
}


function printMealInfo(recipe) {
    const meal = recipe.meals[0];
    printOutput(`Nome del piatto: ${meal.strMeal}`);
    printOutput(`Categoria: ${meal.strCategory}`);
    printOutput(`Area: ${meal.strArea}`);
    printOutput(`Istruzioni: ${meal.strInstructions}`);
}

function handleCommand(command) {
    const args = command.split(' ');
    const cmd = args.shift().toLowerCase();

    switch (cmd) {
        case 'datetime':
            getCurrentDateTime();
            break;
        case 'meteo':
            if (args.length === 0) {
                printOutput('Inserisci una città.');
            } else {
                const city = args.join(' ');
                getWeather(apiKey, city);
            }
            break;
        case 'request':
            if (args.length === 0) {
                printOutput('Inserisci un URL.');
            } else {
                makeRequest(args[0]);
            }
            break;
        case 'clear':
            clearTerminal();
            break;
        case 'cracco':
            getMeal('https://www.themealdb.com/api/json/v1/1/random.php');
            break;
        case 'help':
            printOutput(`
                - datetime: Stampare data e orario attuali <br>
                - meteo [città]: Ottieni il meteo per la città specificata <br>
                - request [url]: Effettua una richiesta di rete all'URL specificato e stampa il risultato in console <br>
                - clear: Pulisce il terminale <br>
                - cracco: Esegue un comando fantasioso <br>
                - help: Mostra questo elenco di comandi <br>
            `);
            break;
        default:
            printOutput(`Comando non riconosciuto: ${cmd}. Digita 'help' per vedere l'elenco dei comandi.`);
    }
}

exitButton.addEventListener('click', function() {
    terminal.remove();
});

ingrandisciButton.addEventListener('click', function() {
    terminal.style.width = '100%';
    terminal.style.height = '100%';
});

abbassaButton.addEventListener('click', function() {
    terminal.style.width = '50%';
    terminal.style.height = '50%';
});

terminalInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        const command = terminalInput.value.trim();
        if (command !== '') {
            printOutput(`<span id="prompt">thecorps@FissoGP:$</span> ${command}`);
            handleCommand(command);
            terminalInput.value = '';
        }
        else{
            printOutput(`<span id="prompt">thecorps@FissoGP:$</span>`);
            terminalInput.value = '';
        }
    }
    terminalInput.focus();
});
