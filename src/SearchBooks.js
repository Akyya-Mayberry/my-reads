import React, { Component } from 'react'
import ListBooks from './ListBooks'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import PropTypes from 'prop-types'

class SearchBooks extends Component {

    static propTypes = {
        books: PropTypes.array.isRequired,
        updateShelves: PropTypes.func.isRequired
    }

    timer = null

    state = {
        matched: [],
        query: "",
        querying: false,
        message: 'Enter Search Term',
        books: [],
    }

    /**
     * Retrieves book from the shelved books
     * @param {book} - book to find
     * @param {books} - list of books on shelf
     */
    getBookFromShelf(book, books) {
        const list = books.filter(shelfedBook => {
            return shelfedBook.id === book.id
        })

        return list.length > 0 ? list[0] : null
    }

    /**
     * Updates searched book results with
     * with their proper shelf
     * @param {searchedBookResults} - the matched books from the query
     * @param {books} - a list of book objects to pull shelf from
     */
    shelfBooks = (searchedBookResults = [], books = []) => {
        if (searchedBookResults.length > 0) {
            return searchedBookResults.map(matchedBook => {

                const currentBooks = books.length > 0 ?
                    books :
                    this.props.books;

                // See if current match is on the shelf
                const book = this.getBookFromShelf(matchedBook, currentBooks)

                // Update shelf
                matchedBook.shelf = book ? book.shelf : 'none'

                return matchedBook
            })
        }
    }

    /**
     * Handles what message to display when use is
     * waiting for user to search, user is searching
     * or search term invalid or search return matches
     */
    updateMessage = () => {
        const { matched, querying, query } = this.state

        // Waiting for search term, search term invalid, or searching
        if (query === "" ||
            query === undefined ||
            query.length === 0) {
            this.setState({ message: "Enter Search Term" })
        } else if (matched.length === 0 &&
            !querying &&
            query !== "") {
            this.setState({ message: 'Invalid Search Term' })
        } else if (querying) {
            this.setState({ message: "searching..." })
        } else {
            this.setState({ message: '' })
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.books !== this.props.books) {
            const matchedWithShelves = this.shelfBooks(
                this.state.matched,
                nextProps.books
            )
            this.setState({ books: matchedWithShelves });
            return true
        }
    }

    updateQuery = async function (query) {
        if (this.timer) { clearTimeout(this.timer) }

        this.setState({ query: query })

        // Empty strings should return no results
        if (query.length === 0 || query === "") {
            this.setState({ matched: [], querying: false, }, this.updateMessage)
            return
        }

        // Start the search
        this.setState({ querying: true }, this.updateMessage)

        // If search term includes query string, retrieve matching books
        const found = await BooksAPI.searchTerms.filter(t => {

            if (t.toLowerCase().includes(query.toLowerCase())) {

                return BooksAPI.search(query.toLowerCase(), 100).then(rsp => {

                    // Search term not found
                    if (rsp.hasOwnProperty('error')) {
                        this.timer = setTimeout(() => {
                            this.setState(
                                { matched: [], querying: false, },
                                this.updateMessage
                            )
                        }, 2000)
                        return false
                    } else {
                        const matchedWithShelves = this.shelfBooks(rsp)

                        this.timer = setTimeout(() => {
                            this.setState(
                                { matched: matchedWithShelves, querying: true, },
                                this.updateMessage
                            )
                            return true

                        }, 2000)
                    }
                })
            }
        })

        if (found && found.length < 1) {
            this.setState(
                { matched: [], querying: false },
                this.updateMessage
            )
        }
    }

    render() {
        return (
            <div className="search-rsp">
                <div className="search-books-bar">
                    <Link className="close-search"
                        to="/">Close</Link>
                    <div className="search-books-input-wrapper">
                        <input type="text"
                            placeholder="Search by title or author"
                            value={this.state.query}
                            onChange={(event) => this.updateQuery(event.target.value)}
                        />
                    </div>
                </div>

                <div className="search-books-results">
                    <ol className="books-grid"></ol>
                </div>

                <ListBooks
                    message={this.state.message}
                    updateShelves={this.props.updateShelves}
                    books={this.state.query === "" ? [] : this.state.matched}
                />
            </div>
        )
    }
}

export default SearchBooks