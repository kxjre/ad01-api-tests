const cache = {};

export function fetchCollection(query = '') {
    if (cache[query]) return cy.wrap(cache[query]);

    return cy.request({
        method: 'GET',
        url: Cypress.env('base_url'),
        qs: {
            key: Cypress.env('api_key'),
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
        url: Cypress.env('base_url') + `${objectNumber}`,
        qs: {
            key: Cypress.env('api_key'),
            format: 'json'
        }
    }).then((response) => {
        cache[objectNumber] = response;
        return response;
    });
}