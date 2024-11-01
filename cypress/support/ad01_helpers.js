const cache = {};
export const API_KEY = Cypress.env('API_KEY');
export const BASE_URL = Cypress.env('BASE_URL');

export function fetchCollection(query = '') {
    if (cache[query]) return cy.wrap(cache[query]);

    return cy.request({
        method: 'GET',
        url: BASE_URL,
        qs: {
            key: API_KEY,
            format: 'json',
            q: query
        }
    }).then((response) => {
        cache[query] = response;
        return response;
    });
}

export function fetchArtObject(objectNumber) {
    if (cache[objectNumber]) return cy.wrap(cache[objectNumber]);

    return cy.request({
        method: 'GET',
        url: BASE_URL + `${objectNumber}`,
        qs: {
            key: API_KEY,
            format: 'json'
        }
    }).then((response) => {
        cache[objectNumber] = response;
        return response;
    });
}