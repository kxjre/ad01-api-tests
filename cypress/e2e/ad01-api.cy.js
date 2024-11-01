import { API_KEY, BASE_URL, fetchCollection, fetchArtObject } from '../support/ad01_helpers';

describe('Rijksmuseum API Tests', () => {
    
    it('GET Collection Metadata - Check Status and Content', () => {
      cy.request({
        method: 'GET',
        url: BASE_URL,
        qs: {
          key: API_KEY,
          format: 'json'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('artObjects');
      });
    });

    it('GET Object Metadata - Validate Object Details', () => {
      const objectNumber = 'SK-C-5'; // Example object number
      
      cy.request({
        method: 'GET',
        url: BASE_URL + `${objectNumber}`,
        qs: {
          key: API_KEY,
          format: 'json'
        }
      }).then((response) => {
        cy.logResponse(response);
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('artObject');
        expect(response.body.artObject).to.have.property('objectNumber', objectNumber);
      });
    });

    // Test 1: Check search functionality by querying for "Rembrandt"
    it('GET Collection Metadata with Search Query - Verify Rembrandt Results', () => {
      fetchCollection('Rembrandt').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('artObjects');
        
        const artObjects = response.body.artObjects;
        expect(artObjects.length).to.be.greaterThan(0);
        
        // Verify structure of first few items in the collection
        artObjects.slice(0, 3).forEach((object) => {
          expect(object).to.have.property('objectNumber');
          expect(object).to.have.property('title');
          expect(object).to.have.property('principalOrFirstMaker');
          
          // Retrieve details of each object and validate further
          fetchArtObject(object.objectNumber).then((detailResponse) => {
            expect(detailResponse.status).to.eq(200);
            const artObjectDetail = detailResponse.body.artObject;
            
            // Validate specific properties in detail response
            expect(artObjectDetail).to.have.property('objectNumber', object.objectNumber);
            expect(artObjectDetail).to.have.property('title').and.to.be.a('string');
            expect(artObjectDetail).to.have.property('principalOrFirstMaker').and.to.be.a('string');
            expect(artObjectDetail).to.have.property('productionPlaces').and.to.be.an('array');
        });
      });
    });
  });

    // Test 2: Get details of a specific art object (e.g., "SK-C-5") and check key fields
    it('GET Art Object Metadata - Validate Detailed Information for a Specific Object', () => {
      const objectNumber = 'SK-C-5'; // Example: The Night Watch by Rembrandt

      fetchArtObject(objectNumber).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('artObject');

        const artObject = response.body.artObject;
        expect(artObject).to.have.property('objectNumber', objectNumber);
        expect(artObject).to.have.property('title', 'De Nachtwacht');
        expect(artObject).to.have.property('principalOrFirstMaker', 'Rembrandt van Rijn');
        expect(artObject).to.have.property('webImage').and.to.have.property('url');
      });
    });

    // Test 3: Verify if materials and colors are included in a specific object
    it('GET Art Object Metadata - Verify Colors and Materials', () => {
      const objectNumber = 'SK-A-317'; // Example: A popular object with color data

      fetchArtObject(objectNumber).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('artObject');

        const artObject = response.body.artObject;
        expect(artObject).to.have.property('colors');
        expect(artObject.colors).to.be.an('array').and.not.to.be.empty;

        expect(artObject).to.have.property('materials');
        expect(artObject.materials).to.be.an('array').and.not.to.be.empty;
      });
    });

    // Test 4: Validate pagination by requesting only a subset of results per page
    it('GET Collection Metadata - Validate Pagination by Limiting Results per Page', () => {
      cy.request({
        method: 'GET',
        url: BASE_URL,
        qs: {
          key: API_KEY,
          format: 'json',
          ps: 5 // Limit results to 5 per page
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('artObjects');
        expect(response.body.artObjects.length).to.eq(5); // Confirm we only got 5 results
      });
    });

    // Test 5: Search with an invalid query and check for an empty result set
    it('GET Collection Metadata with Invalid Search Query - Validate Empty Results', () => {
      fetchCollection('nonexistentquery').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('artObjects');
        expect(response.body.artObjects.length).to.eq(0); // Expecting 0 results
      });
    });
});