const terminal = document.querySelector(".terminal");
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");
const inputLine = document.querySelector(".input-line");

const exitButton = document.querySelector(".close-btn");
const restoreButton = document.getElementById('restoreButton');
const maximizeButton = document.querySelector(".maximize-btn");
const minimizeButton = document.querySelector(".minimize-btn");
const placeholder = document.createElement('div');
placeholder.id = 'placeholder';

const apiKey = "cb7bdea4e23eebc003fec1a9c3b03c3d";

/**
 * Questa funzione stampa un messaggio nell'output del terminale.
 * 
 * @param {string} message 
 */
function printOutput(message) {
    const outputDiv = document.createElement("div");
    outputDiv.className = "output-line";
    outputDiv.innerHTML = message;
    terminalOutput.appendChild(outputDiv);
    terminalOutput.appendChild(inputLine);
}

/**
 * Stampa la data e l'ora attuali nel terminale.
 */
function getCurrentDateTime() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    printOutput(formattedDate);
}

/**
 * Effettua una richiesta HTTP GET a un URL specificato e stampa il risultato.
 * 
 * @param {string} url 
 */
function makeRequest(url) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => printOutput(JSON.stringify(data, null, 2)))
        .catch((error) =>
            printOutput(`Errore durante la richiesta: ${error}`)
        );
}

/**
 * Pulisce il contenuto del terminale.
 */
function clearTerminal() {
    terminalOutput.innerHTML = "";
    terminalOutput.appendChild(inputLine);
}

/**
 * Ottiene le informazioni meteo per una città specificata e le stampa nel terminale.
 * 
 * @param {string} apiKey 
 * @param {string} city 
 */
async function getWeather(apiKey, city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Errore nella richiesta");
        }
        const data = await response.json();
        printWeatherInfo(data);
    } catch (error) {
        printOutput("Errore: City not found");
    }
}

/**
 * Stampa le informazioni meteo dettagliate.
 * 
 * @param {*} weatherData 
 */
function printWeatherInfo(weatherData) {
    const location = weatherData.name;
    const country = weatherData.sys.country;
    const temperature = weatherData.main.temp;
    const weatherDescription = weatherData.weather[0].description;
    const windSpeed = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    const sunrise = new Date(
        weatherData.sys.sunrise * 1000
    ).toLocaleTimeString();
    const sunset = new Date(
        weatherData.sys.sunset * 1000
    ).toLocaleTimeString();

    printOutput(`Località: ${location}, ${country}`);
    printOutput(`Temperatura: ${temperature}°C`);
    printOutput(`Tempo: ${weatherDescription}`);
    printOutput(`Velocità del vento: ${windSpeed} m/s`);
    printOutput(`Umidità: ${humidity}%`);
    printOutput(`Alba: ${sunrise}`);
    printOutput(`Tramonto: ${sunset}`);
}

/**
 * Ottiene una ricetta casuale e la stampa nel terminale.
 * 
 * @param {string} url 
 */
async function getMeal(url) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => printMealInfo(data))
        .catch((error) =>
            printOutput(`Errore durante la richiesta: ${error}`)
        );

    console.log(typeof data);
}

/**
 * Stampa le informazioni dettagliate della ricetta.
 * 
 * @param {*} recipe 
 */
function printMealInfo(recipe) {
    const meal = recipe.meals[0];
    printOutput(`Nome del piatto: ${meal.strMeal}`);
    printOutput(`Categoria: ${meal.strCategory}`);
    printOutput(`Area: ${meal.strArea}`);
    printOutput(`Istruzioni: ${meal.strInstructions}`);
}

/**
 * Stampa una lista di comandi disponibili.
 */
function printHelpCommand() {
    printOutput("- datetime: Stampare data e orario attuali");
    printOutput(
        "- meteo [città]: Ottieni il meteo per la città specificata"
    );
    printOutput(
        "- request [url]: Effettua una richiesta di rete all'URL specificato e stampa il risultato in console"
    );
    printOutput("- cracco: Esegue un comando fantasioso");
    printOutput("- clear: Pulisce il terminale");
    printOutput("- help: Mostra questo elenco di comandi");
}

/**
 * Gestisce l'input dell'utente e chiama le funzioni appropriate in base al comando inserito.
 * 
 * @param {string} command 
 */
function handleCommand(command) {
    const args = command.split(" ");
    const cmd = args.shift().toLowerCase();

    switch (cmd) {
        case "datetime":
            getCurrentDateTime();
            break;
        case "meteo":
            if (args.length === 0) {
                printOutput("Inserisci una città.");
            } else {
                const city = args.join(" ");
                getWeather(apiKey, city);
            }
            break;
        case "request":
            if (args.length === 0) {
                printOutput("Inserisci un URL.");
            } else {
                makeRequest(args[0]);
            }
            break;
        case "clear":
            clearTerminal();
            break;
        case "cracco":
            getMeal(
                "https://www.themealdb.com/api/json/v1/1/random.php"
            );
            break;
        case "help":
            printHelpCommand();
            break;
        default:
            printOutput(
                `Comando non riconosciuto: ${cmd}. Digita 'help' per vedere l'elenco dei comandi.`
            );
    }
}

/**
 * Tronca un comando se supera una certa lunghezza.
 * 
 * @param {string} command 
 * @returns {string}
 */
function truncateCommand(command) {
    if (command.length > 70) {
        return command.slice(0, 69) + "...";
    }
    return command;
}

terminalInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const command = terminalInput.innerText.trim();
        if (command !== "") {
            commandPassed = truncateCommand(command);
            printOutput(
                `<span id="prompt">thecorps@FissoGP:$</span> ${commandPassed}`
            );
            handleCommand(commandPassed);
            terminalInput.innerText = "";
        } else {
            printOutput(
                `<span id="prompt">thecorps@FissoGP:$</span>`
            );
            terminalInput.innerText = "";
        }
    }
    terminalInput.focus();
});

exitButton.addEventListener("click", function () {
    terminal.parentNode.insertBefore(placeholder, terminal);
    terminal.remove();
    placeholder.style.display = 'block';
});

restoreButton.addEventListener("click", function () {
    if (document.getElementById('placeholder')) {
        placeholder.parentNode.insertBefore(terminal, placeholder);
        placeholder.remove();
    }
});

maximizeButton.addEventListener("click", function () {
    terminal.style.width = "100%";
    terminal.style.height = "100%";
});

minimizeButton.addEventListener("click", function () {
    terminal.style.width = "1000px";
    terminal.style.height = "550px";
});

document.addEventListener("DOMContentLoaded", (event) => {
    let offsetX = 0;
    let offsetY = 0;

    terminal.addEventListener("dragstart", (e) => {
        terminal.classList.add("dragging");
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    terminal.addEventListener("dragend", (e) => {
        terminal.classList.remove("dragging");
    });

    document.addEventListener("dragover", (e) => {
        e.preventDefault();
        const draggingElement = document.querySelector(".dragging");
        if (draggingElement) {
            draggingElement.style.left = `${e.clientX - offsetX}px`;
            draggingElement.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("drop", (e) => {
        e.preventDefault();
        const draggingElement = document.querySelector(".dragging");
        if (draggingElement) {
            draggingElement.style.left = `${e.clientX - offsetX}px`;
            draggingElement.style.top = `${e.clientY - offsetY}px`;
            draggingElement.classList.remove("dragging");
        }
    });
});