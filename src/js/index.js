import { dragElement } from "./utilities.js"
import { fetchAPI } from "./utilities.js"
import { getSelectedInput } from "./utilities.js"
import { hexToRgbA } from "./utilities.js"
import { changeInputColor } from "./utilities.js"
import { handleError } from "./utilities.js"
import { handleInputError } from "./utilities.js"

// const price = -0.25723
// if (price.toString()[0] === "-") {
//     console.log("negative number")
// } else {console.log("positive number")}



///// UNSPLASH SECTION /////
async function renderUnsplash(query) {
    // let query = "nature"
    try {
        const data = await fetchAPI("unsplash", `https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=${query}`)
        document.body.style.backgroundImage = `url(${data.urls.full})`
        document.getElementById("unsplash").innerHTML = `
        <i class="fa-solid fa-camera"></i>
        <p>Photo by <a class="outbound-link" href="https://unsplash.com/@${data.user.name}?utm_source=tech_and_elegance&utm_medium=referral" target="_blank">${data.user.name}</a> on <a class="outbound-link" href="https://unsplash.com/?utm_source=tech_and_elegance&utm_medium=referral" target="_blank">Unsplash</a></p>
        `
    }
    
    catch(error) {
        // Fallback image and author
        document.body.style.backgroundImage = "url(https://images.unsplash.com/photo-1453872302360-eed3c5f8ff66?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTM3NTQ2NTR8&ixlib=rb-4.0.3&q=85)"
        document.getElementById("unsplash").innerHTML = `
        <p>Photo by <a class="outbound-link" href="https://unsplash.com/@Andrew Coelho?utm_source=tech_and_elegance&amp;utm_medium=referral" target="_blank">Andrew Coelho</a> on <a class="outbound-link" href="https://unsplash.com/?utm_source=tech_and_elegance&amp;utm_medium=referral" target="_blank">Unsplash</a></p>
        `
    }
}

const form = document.getElementById("form")
form.addEventListener("submit", function(e) {
    e.preventDefault()
    const themePicker = document.getElementById("themePicker")
    const query = themePicker.value.toLowerCase()
    if (query) {
        renderUnsplash(query) 
        themePicker.value = ""
    } else {
        handleError()
        handleInputError()
    }
})

////// CRYPTO SECTION /////

// default to EURO
let currencySymbol = "€"
let currency = "eur"

async function renderCoinGecko(array) {
    const cryptoDataEl = document.getElementById("crypto-data")
    try {
        cryptoDataEl.innerHTML = ""
        // make the forEAch async to allow the await fetch to work
        array.forEach(async coin => {
            const data = await fetchAPI("CoinGecko", `https://api.coingecko.com/api/v3/coins/${coin}`)
            
            const caret = data.market_data.price_change_percentage_24h.toString()[0]  === "-" ? "down" : "up"
            const priceChange = Number(data.market_data.price_change_percentage_24h).toFixed(2)
            
            // use [variable] inside dot notation to access the variable in the template string
            document.getElementById("crypto-data").innerHTML += `
                <li class="crypto-data">
                    <img class="crypto-image align-center"src=${data.image.small}>
                    <h3 class="crypto-name">${data.name}</h3>
                    <h4 class="crypto-symbol">${data.symbol}</h4>
                    <h3 class="crypto-price">${currencySymbol}${data.market_data.current_price[currency]}</h3> 
                    <div class="crypto-change flex gap05">
                        <i class="fa-solid fa-caret-${caret}"></i>
                        <h4>${priceChange}%</h4>
                    </div>
                </li>

            `
        })
    }
    catch(error) {
        console.error(error)
    }
}

document.getElementById("refresh-crypto-btn").addEventListener("click", function() {
    renderCoinGecko(getSelectedInput("cryptocurrency"))
})


// Currency selector in dialog
const currencySelector = document.getElementById("currency-selector")
currencySelector.addEventListener("change", function() {
    switch (currencySelector.value) {
        case "EUR":
            currencySymbol = "€";
            currency = "eur"
            break;
        case "USD":
            currencySymbol = "$";
            currency = "usd"
            break;
        case "AUD":
            currencySymbol = "A$";
            currency = "aud"
            break;
        case "HKD":
            currencySymbol = "HK$";
            currency = "hkd"
            break;
        case "GBP":
            currencySymbol = "£";
            currency = "gbp"
            break;
        case "JPY":
            currencySymbol = "¥";
            currency = "jpy"
            break;
        default:
            currencySymbol = "€"; // Default to EUR if none matched
    }
    renderCoinGecko(getSelectedInput("cryptocurrency"))
})

// Listening to change on crypto checkboxes and running renderCoinGecko
const cryptoInputs = document.querySelectorAll('input[name="cryptocurrency"]');
cryptoInputs.forEach(function (checkbox) {
    checkbox.addEventListener("change", function() {
        renderCoinGecko(getSelectedInput("cryptocurrency"))
    })
})

///// TIME SECTION /////

function renderTime() {
    const locale = localeSelector.value

    const date = new Date()
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' }
    const formattedDate = date.toLocaleDateString(locale, dateOptions)

    const timeOptions = {timeStyle: "short"}
    const formattedTime = date.toLocaleTimeString(locale, timeOptions)
    document.querySelector(".time h1").textContent = formattedDate
    document.querySelector(".time h2").textContent = formattedTime
};


const localeSelector = document.getElementById("locale-selector")
localeSelector.addEventListener("change", function() {
    renderTime()
})


///// WEATHER SECTION /////
async function renderWeather() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    async function success(pos) {
        const crd = pos.coords;
        const latitude = crd.latitude
        const longitude = crd.longitude

        const units = getSelectedInput("units")

        try { 
            const res = await fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}`)
            if (!res.ok) {
                throw Error (`Could not fetch data`)
            }
            const data = await res.json()

            const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            const temp = `${Math.round(data.main.temp)}°` 
            const lowTemp = `${Math.round(data.main.temp_min)}` 
            const highTemp = `${Math.round(data.main.temp_max)}` 
            const description = data.weather[0].description[0].toUpperCase() + data.weather[0].description.slice(1) // capitalize first letter
            const windSpeed = units == "metric" ? (data.wind.speed * 3.6).toFixed(1) + ' km/h' : data.wind.speed.toFixed(1) + ' mph'

            document.getElementById("weather-data").innerHTML = `
                <div class="weather-main">
                    <h3 class="weather-name">${data.name} <i class="fa-solid fa-location-arrow"></i></h3>
                    <h2 class="weather-temp">${temp}</h2>
                    <img class="weather-img" src=${iconUrl} alt=${description} title=${description}>
                    <p class="weather-description">${description}</p>
                    <p class="weather-details fs-500">L:${lowTemp}° H:${highTemp}°</p>
                    <p class="weather-wind">Wind speed</p>
                    <p class="weather-speed fs-500">${windSpeed}</p>
                </div>
            `
        }
        catch (error) {
            console.error(error)
            handleError()
        }
    }
    
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    
    navigator.geolocation.getCurrentPosition(success, error, options);
}

// Listening to change on units checkboxes and running renderWeather
const unitInputs = document.querySelectorAll('input[name="units"]');
unitInputs.forEach(function (radio) {
    radio.addEventListener("change", function() {
        renderWeather()
    })
})


///// COLOR SECTION /////

const glassColorPicker = document.getElementById("glassColorPicker")
glassColorPicker.addEventListener("input", function() {
    changeGlassColor()
})

// Changes the background-color of all .glass divs
function changeGlassColor() {
    const selectedColor = hexToRgbA(glassColorPicker.value, "0.2")
    const divs = document.querySelectorAll(".glass")
    divs.forEach(div => {
        div.style.backgroundColor = selectedColor
    })
}

const inputColorPicker = document.getElementById("inputColorPicker")
inputColorPicker.addEventListener("input", function() {
    changeInputColor("--clr-input", inputColorPicker.value)

})



///// UTILITIES /////

// Showing the dialog
const showDialogButtons = document.querySelectorAll(".show-dialog")

const dialog = document.getElementById("dialog");

showDialogButtons.forEach(button => {
    button.addEventListener("click", () => {
        dialog.showModal()
    })
})

// Closing the dialog
dialog.addEventListener("click", (e) => {
  const dialogDimensions = dialog.getBoundingClientRect()
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom ||
    e.target.id === "close-dialog" ||
    e.target.classList.contains("fa-xmark")
  ) dialog.close()
})


// Run on load //
renderUnsplash("dark")
renderCoinGecko(getSelectedInput("cryptocurrency"))
setInterval(renderTime, 1000);
renderWeather()

// Make the sections draggable:
dragElement(document.getElementById("crypto"));
dragElement(document.getElementById("time"));
dragElement(document.getElementById("weather"));



