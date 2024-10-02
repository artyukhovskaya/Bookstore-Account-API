/*  5 API Запросов. На выбор. С одного из двух свагерров
https://demoqa.com/swagger/
https://petstore.swagger.io/ */

/// <reference types="cypress" />

import _ from 'lodash';

describe('Bookstore Account', () => {
    const baseUrl = 'https://demoqa.com';
    const user = {
        username: 'TestyTest${_.random(10, 1000)}',
        password: 'Password1!',
        id: null,
        token: null
    };

    it('Create user', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/Account/v1/User`,
            headers: { 'content-type': 'application/json' },
            body: {
                userName: user.username,
                password: user.password
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('userID');
            expect(response.body).to.have.property('username', user.username);
            expect(response.body).to.have.property('books').that.is.an('array');
            expect(response.body.books).to.be.empty;
            user.id = response.body['userID'];
            cy.log(`User created with ID: ${user.id}`);
        });
    });

    it('Generate token', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/Account/v1/GenerateToken`,
            headers: { 'content-type': 'application/json' },
            body: {
                userName: user.username,
                password: user.password
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            expect(response.body).to.have.property('status', 'Success');
            expect(response.body).to.have.property('result', 'User authorized successfully.');
            user.token = response.body['token'];
            cy.log(`Token generated: ${user.token}`);
        });
    });

    it('Get user info', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/Account/v1/User/${user.id}`,
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${user.token}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('username', user.username);
            expect(response.body).to.have.property('userId', user.id);
            cy.log(`User info retrieved: ${JSON.stringify(response.body)}`);
        });
    });

    it('Authorized', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/Account/v1/Authorized`,
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: {
                userName: user.username,
                password: user.password
            }
        }).then((response) => {
            expect(response.status).to.eq(200); // Задай ожидаемый статус
            expect(response.body).to.eq(true);
        });
    });

    it('Delete user', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/Account/v1/User/${user.id}`,
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${user.token}`
            }
        }).then((response) => {
            expect(response.status).to.eq(204);
            cy.log(`User deleted with ID: ${user.id}`);
        });
    });
});
