/// <reference types="cypress" />

const { tokenToString } = require("typescript")

describe('Test with backend', () => {
    beforeEach('login to the app', () => {
        cy.intercept({method: 'GET', path: 'tags'}, {fixture: 'tags.json'} )
        cy.loginToApplication()
    })

    it('veryfy correct request and response', () => {

        cy.intercept('POST', 'https://api.realworld.io/api/articles/').as('postArticles')

        cy.contains('New Article').click()
        cy.get('[placeholder="Article Title"]').type('This is the title')
        cy.get('[formcontrolname="description"]').type('tHIS IS A DESCRIPTION')
        cy.get('[formcontrolname="body"]').type('This is a body of the article')
        cy.contains('Publish Article').click()


        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(201)
            expect(xhr.request.body.article.body).to.equal('This is a body of the article')
            expect(xhr.response.body.article.description).to.equal('tHIS IS A DESCRIPTION')
        })
    })

    it('verify popular tags are displayed', () => {
        cy.get('.tag-list')
        .should('contain', 'cypress')
        .and('contain', 'automation')
        .and('contain', 'testing')
    })

    it('verify global feed likes count', () => {
        cy.intercept('GET', 'https://api.realworld.io/api/articles/feed*', {"articles":[],"articlesCount":0})
        cy.intercept('GET', 'https://api.realworld.io/api/articles*', {fixture: 'articles.json'})

        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then(heartList => {
            expect(heartList[0]).to.contain('1')
            expect(heartList[1]).to.contain('5')
        })

        cy.fixture('articles').then(file => {
            const articleLink = file.articles[1].slug
            file.articles[1].favouritesCount = 6
            cy.intercept('POST', 'https://api.realworld.io/api/articles/'+articleLink+'/favorite', file)
        })

        cy.get('app-article-list button').eq(1).click().should('contain', '6')

    })

    it.only('delete a new article in a global feed', () => {
        const userCredentials = {
          "user": {
            "email": "natalia@natalia.pl",
            "password": "tester123"
          }
        }
      
        const bodyRequest = {
          "article": {
            "tagList": [],
            "title": " asdfqwer",
            "description": "asdfqwer",
            "body": "asdfqwer",
          }
        }
      
        cy.request('POST', 'https://api.realworld.io/api/users/login', userCredentials)
          .its('body').then(body => {
            const token = body.user.token


            cy.request({
              url:'https://api.realworld.io/api/articles/',
              headers: {'Authorization': 'Token '+token},
              method: 'POST',
              body: bodyRequest
            }).then (response => {
              expect(response.status).to.equal(201)
            })
            cy.contains('Global Feed').click()
            cy.get('.preview-link').first().click()
            cy.get('.article-meta').contains('Delete Article').click()

            cy.request({
              url: 'https://api.realworld.io/api/articles?limit=10&offset=0',
              headers: {'Authorization': 'Token '+token},
              method: 'GET'
            }).its('body').then(body => {
              expect(body.articles[0].title).not.to.equal('asdfqwer')
            })
          })
      })
      
   
})