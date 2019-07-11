// import moment from 'moment'

import supertest from 'supertest'
import chai from 'chai'
// import axios from 'axios'
import { config } from '../../../.env.test'

import Book from '../../src/models/book'

const request = supertest(config().HOST)
const { expect } = chai // BDD/TDD assertion library

// function createTestBook(location, daysAgo) {
//   const createdAt = moment().subtract(daysAgo, 'days').add(3, 'minutes')
//   const updatedAt = createdAt
//   const title = 'test title'
//   const description = 'test description'
//   const author = 'test author'
//   const tags = 'test tags'
//   // create and safe record
//   let book
//   try {
//     book = Book.create({
//       createdAt,
//       updatedAt,
//       title,
//       description,
//       author,
//       tags,
//     })
//   } catch (err) {
//     console.log('unable to create Book', err)
//   }
//   return book
// }


describe('hello world', () => {
  it.only('should respond to hello world get', async () => {
    const response =
    await request
      .get('/hello')

    expect(response.status).to.equal(200)
    expect(response.body).to.equal('Hello Books world!')
  })
})


describe('books', () => {
  beforeEach(async () => {
    await Book.destroy({
      where: {},
    })
  })

  describe('create', () => {
    it('should not be able to post a book with no parameters', async () => {
      const response =
      await request
        .post('/books')
        .set('Content-Type', 'application/json')

      expect(response.status).to.equal(400)
      expect(response.body.error).to.equal('parameters missing')
    })
  })
})
