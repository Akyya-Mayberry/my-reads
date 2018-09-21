import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import ListBooks from './ListBooks'
import escapeRegExp from 'escape-string-regexp'
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'

// import sortBy from 'sort-by'

class BooksApp extends React.Component {
  shelves = [
    'Currently Reading',
    'Want to Read',
    'Read'
  ]

  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    books: [],
    matched: [],
    query: ''
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books: books })
      console.log('num of books: ', books.length)
    })
  }

  updateQuery = (query) => {

    this.setState({ query: query })
    console.log('query: ', query)
    // Empty strings should return no results
    if (query.length === 0 || query === "") {
      this.setState({ matched: [] })
      return
    }

    // If search term includes query string, retrieve matching books
    BooksAPI.searchTerms.filter(t => {
      // console.log('search term', t)
      if (t.toLowerCase().includes(query.toLowerCase())) {
        BooksAPI.search(query.toLowerCase(), 100).then(books => {
          this.setState({ matched: books })
        })
      } else {
        this.setState({ matched: [] })
      }
    })
  }

  updateShelves = (book, shelf) => {
    this.setState(state => ({
      books: state.books.map(b => {
        if (b.id === book.id) {
          b.shelf = shelf
        }
        return b
      })
    }))
  }

  render() {

    return (
      <div className="app">


        <Route exact path='/search' render={() => (

          // TODO: Move search to a component
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search"
                to="/">Close</Link>
              <div className="search-books-input-wrapper">
                <input type="text"
                  placeholder="Search by title or author"
                  value={this.state.query}
                  onChange={(event) => this.updateQuery(event.target.value)} />

              </div>
            </div>

            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>

            <ListBooks
              updateShelves={this.updateShelves}
              books={this.state.query === "" ? [] : this.state.matched} />

          </div>
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

                {/* TODO: 
                    Can shelves be made into loop instead of hardcoded individually?
                  */}

                {/*Currently Reading*/}
                <h2 className="bookshelf-title">Currently Reading</h2>
                <ListBooks updateShelves={this.updateShelves}
                  books={this.state.books.filter(b => b.shelf === 'currentlyReading')} />

                {/* Want To Read*/}
                <h2 className="bookshelf-title">Want to Read</h2>
                <ListBooks updateShelves={this.updateShelves}
                  books={this.state.books.filter(b => b.shelf === 'wantToRead')} />

                {/* Read */}
                <h2 className="bookshelf-title">Read</h2>
                <ListBooks updateShelves={this.updateShelves}
                  books={this.state.books.filter(b => b.shelf === 'read')} />

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
