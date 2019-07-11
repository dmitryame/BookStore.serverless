// import moment from 'moment'

import supertest from 'supertest'
import chai from 'chai'
// import axios from 'axios'
import { config } from '../../../.env.test'

import Book from '../../src/models/book'

const request = supertest(config().HOST)
const { expect } = chai // BDD/TDD assertion library

async function createTestBook({
  title, description, author, tags,
}) {
  // create and safe record
  let book
  try {
    book = await Book.create({
      title,
      description,
      author,
      tags,
    })
  } catch (err) {
    console.log('unable to create Book', err)
  }
  return book
}


describe('hello world', () => {
  it('should respond to hello world get', async () => {
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
    it('should not be able to create a book with no parameters', async () => {
      const response =
      await request
        .post('/books')
        .set('Content-Type', 'application/json')

      expect(response.status).to.equal(400)
      expect(response.body.error).to.equal('parameters missing')
    })

    it('should be able to create a book with right parameters', async () => {
      const title = 'test title'
      const description = 'test description'
      const author = 'test author'
      const tags = 'test tags'

      const response =
        await request
          .post('/books')
          .set('Content-Type', 'application/json')
          .send({ title })
          .send({ description })
          .send({ author })
          .send({ tags })

      expect(response.status).to.equal(201)
      expect(response.body.status).to.equal('success')
      expect(response.body.book.title).to.equal(title)
      expect(response.body.book.description).to.equal(description)
      expect(response.body.book.author).to.equal(author)
      expect(response.body.book.tags).to.equal(tags)
    })
  })

  describe('list', () => {
    it('should be able to retrieve all books', async () => {
      createTestBook({
        title: 'book 1',
        description: 'descriuption 1',
        author: 'author 1',
        tags: 'test, one, two, tree',
      })
      createTestBook({
        title: 'book 2',
        description: 'descriuption 2',
        author: 'author 2',
        tags: 'test, one, two, tree',
      })
      const response =
        await request
          .get('/books')
          .set('Content-Type', 'application/json')

      expect(response.status).to.equal(200)
      expect(response.body.status).to.equal('success')
      expect(response.body.books.length).to.equal(2)
    })
  })

  describe('read', () => {
    it('should not be able to find a book which does not exist', async () => {
      const response =
      await request
        .get('/books/0')
        .set('Content-Type', 'application/json')

      expect(response.status).to.equal(404)
      expect(response.body.error).to.equal('Book not found')
    })

    it('should be able to find one book by id', async () => {
      const testBook = await createTestBook({
        title: 'book 1',
        description: 'descriuption 1',
        author: 'author 1',
        tags: 'test, one, two, tree',
      })

      const response =
        await request
          .get(`/books/${testBook.id}`)
          .set('Content-Type', 'application/json')


      expect(response.status).to.equal(200)
      expect(response.body.status).to.equal('success')
      expect(response.body.book.title).to.equal(testBook.title)
      expect(response.body.book.description).to.equal(testBook.description)
      expect(response.body.book.author).to.equal(testBook.author)
      expect(response.body.book.tags).to.equal(testBook.tags)
    })
  })
})
