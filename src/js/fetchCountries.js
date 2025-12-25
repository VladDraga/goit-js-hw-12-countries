export default function fetchCountries(searchQuery) {
  const BASE_URL = 'https://restcountries.com/v3.1/name/';
  return fetch(`${BASE_URL}${searchQuery}?fields=name,capital,population,flags,languages`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Country not found');
      }
      return response.json();
    });
}