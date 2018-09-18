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
    query: ''
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
      console.log('num of books: ', books.length)
    })
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }

  changeShelf = (book, shelf) => {
    BooksAPI.update(book, shelf).then(c => {
      console.log('success saving book!')
      this.setState(state => ({
        books: state.books.map(b => {
          if (b.id === book.id) {
            b.shelf = shelf
          }
          return b
        })
      }))
    })
  }

  render() {
    let matchedBooks
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i')
      matchedBooks = this.state.books.filter((book) => match.test(book.title))
    } else {
      matchedBooks = this.state.books
    }

    return (
      <div className="app">
        
        
        <Route exact path='/search' render={() => (

          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search"
                to="/">Close</Link>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text"
                  placeholder="Search by title or author"
                  value={this.state.query}
                  onChange={(event) => this.updateQuery(event.target.value)} />

              </div>
            </div>




            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
            <ListBooks update={this.changeShelf} books={matchedBooks} />
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
                <ListBooks update={this.changeShelf}
                  books={this.state.books.filter(b => b.shelf === 'currentlyReading')} />

                {/* Want To Read*/}
                <h2 className="bookshelf-title">Want to Read</h2>
                <ListBooks update={this.changeShelf}
                  books={this.state.books.filter(b => b.shelf === 'wantToRead')} />

                {/* Read */}
                <h2 className="bookshelf-title">Read</h2>
                <ListBooks update={this.changeShelf}
                  books={this.state.books.filter(b => b.shelf === 'read')} />

              </div>
            </div>

            {/* Search/Add Button */}
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>

          </div>
        )}/>


      </div>
    )
  }
}

export default BooksApp
