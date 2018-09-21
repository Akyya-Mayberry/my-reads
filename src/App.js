import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import ListBooks from './ListBooks'
import SearchBooks from './SearchBooks'
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
    this.setState({query: ""})
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
    BooksAPI.getAll().then((books) => {
      this.setState({ books: books })
      console.log('num of books: ', books.length)
    })
    
    console.log('Parent updated books!')
  }

  render() {

    return (
      <div className="app">


        <Route exact path='/search' render={() => (

          <SearchBooks updateQuery={this.updateQuery}
          matched={this.state.matched} 
          update={this.updateShelves}
          query={this.state.query} />
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
