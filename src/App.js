import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Shelf from './Shelf'
import SearchBooks from './SearchBooks'
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'

class BooksApp extends React.Component {

  state = {
    books: [],
    query: ''
  }

  shelves = {
    currentlyReading: 'Currently Reading',
    wantToRead: 'Want To Read',
    read: 'Read'
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books: books })
    })
  }

  // Callback for child components to alert shelf changed 
  updateShelves = (book, shelf) => {
    BooksAPI.getAll().then((books) => {
      this.setState({ books: books })
    })
  }

  render() {

    return (
      <div className="app">

        <Route exact path='/search' render={() => (
          <SearchBooks books={this.state.books} updateShelves={this.updateShelves} />
        )} />

        <Route exact path='/' render={() => (
          <div className="list-books">

            {/* My Reads Header */}
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>

            {/* The Shelves */}
            <div className="list-books-content">
              <div>
                {
                  Object.entries(this.shelves).map(([key, val]) => {
                    return <Shelf
                      key={key}
                      name={val}
                      books={this.state.books.filter(b => b.shelf === key)}
                      updateShelves={this.updateShelves}
                    />
                  })
                }
              </div>
            </div>

            {/* Search/Add Button */}
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>

          </div>
        )} />

      </div>
    )
  }
}

export default BooksApp
