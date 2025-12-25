import fetchCountries from './fetchCountries.js';
import { debounce } from 'lodash';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const inputRef = document.querySelector('.search-input');
const listRef = document.querySelector('.country-list');
const cardRef = document.querySelector('.country-card-container');

const countryListTemplate = document.querySelector('#country-list-item').content;
const countryCardTemplate = document.querySelector('#country-card').content;

const DEBOUNCE_DELAY = 500;

function clearMarkup() {
  listRef.innerHTML = '';
  cardRef.innerHTML = '';
}

function renderCountryList(countries) {
  countries.forEach(country => {
    const clone = countryListTemplate.cloneNode(true);
    
    clone.querySelector('img').src = country.flags.svg;
    clone.querySelector('img').alt = `Flag of ${country.name.official}`;
    clone.querySelector('span').textContent = country.name.official;
    
    listRef.appendChild(clone);
  });
}

function renderCountryCard(country) {
  const clone = countryCardTemplate.cloneNode(true);
  
  clone.querySelector('img').src = country.flags.svg;
  clone.querySelector('img').alt = `Flag of ${country.name.official}`;
  clone.querySelector('h2').textContent = country.name.official;
  
  const infoItems = clone.querySelectorAll('li');
  infoItems[0].textContent += country.capital[0];
  infoItems[1].textContent += country.population.toLocaleString();
  
  const languages = Object.values(country.languages).join(', ');
  infoItems[2].textContent += languages;
  
  cardRef.appendChild(clone);
}

function onSearch(e) {
  const searchQuery = e.target.value.trim();

  if (!searchQuery) {
    clearMarkup();
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      clearMarkup();

      if (countries.length > 10) {
        error({
          text: 'Занадто багато збігів. Введіть більш конкретну назву!',
          delay: 3000,
        });
      } else if (countries.length >= 2 && countries.length <= 10) {
        renderCountryList(countries);
      } else if (countries.length === 1) {
        renderCountryCard(countries[0]);
      }
    })
    .catch(err => {
      clearMarkup();
      error({
        text: 'Країну не знайдено. Спробуйте іншу назву!',
        delay: 3000,
      });
      console.error(err);
    });
}

inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));