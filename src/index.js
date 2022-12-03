import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryInput: document.querySelector("#search-box"),
  countryList: document.querySelector(".country-list"),
  countryInfo: document.querySelector(".country-info"),
};

refs.countryInput.addEventListener("input", debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput(event) {
    event.preventDefault();

    if (event.target.value.trim() === "") {
        return;
    }
    
    getCountryName(event.target.value.trim());
};


function getCountryName(name) {
    fetchCountries(name.trim())
        .then(countries => {
            if (countries.length > 10) {
                return Notify.info("Too many matches found. Please enter a more specific name.");
            }
            if (2 < countries.length < 10) {
                renderCountryList(countries);
            }
            if (countries.length === 1) {
                renderCountryInfo(countries);
            }
        })
        .catch(error => console.log(error));
}

function renderCountryList(countries) {
  const markup = countries.map(country => {
      return `<li class="country-item">
      <img src="${country.flags.svg}" width="40" alt="flag">
      <p class="country-name">${country.name.official}</p>
      </li>`;
    })
    .join("");

    refs.countryList.innerHTML = markup;
};

function renderCountryInfo(countries) {
    const markup = countries.map(country => {
            return `<p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${country.languages}</p>
          `;
    })
        .join("");
    
    refs.countryInfo.innerHTML = markup;
};