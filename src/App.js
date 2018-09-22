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
    books: [],
    query: ''
  }

  componentDidMount() {
    this.setState({ query: "" })
    BooksAPI.getAll().then((books) => {
      this.setState({ books: books })
    })
  }

  

  // Callback for child components to alert 
  // changed self 
  updateShelves = (book, shelf) => {
    console.log('books changed! update children!')
    BooksAPI.getAll().then((books) => {
      this.setState({ books: books })
    })

    
  }

  render() {

    return (
      <div className="app">


        <Route exact path='/search' render={({ history }) => (
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

                {/* TODO: 
                    Can shelves be made into a seperate component
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
