import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ListBooks from './ListBooks'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'


class SearchBooks extends Component {
    state = {
        matched: [],
        query: "",
        querying: false,
        message: 'Enter Search Term',
        books: [],
    }

    getShelves = (matchedBooks = [], books = []) => {
        if (matchedBooks.length === 0) {
            return
        }

        const matchedWithShelves = matchedBooks.map(matchedBook => {
            let onShelf = []

            if (books.length === 0) {
                onShelf = this.props.books.filter(shelfedBook => {
                    return shelfedBook.id === matchedBook.id
                })
            } else {
                onShelf = books.filter(shelfedBook => {
                    return shelfedBook.id === matchedBook.id
                })
            }

            if (onShelf.length > 0) {
                matchedBook.shelf = onShelf[0].shelf
                return onShelf[0]
            } else {
                matchedBook.shelf = 'none'
            }

            return onShelf[0] || matchedBook
        })

        return matchedWithShelves
    }

    updateMessage = () => {
        const { matched, querying, query } = this.state

        if (query === "" || query === undefined || query.length === 0) {
            this.setState({ message: "Enter Search Term" })
        }

        else if (matched.length === 0 && !querying && query !== "") {
            this.setState({ message: 'Invalid Search Term' })
        }
        else {
            this.setState({ message: "searching..." })
        }
    }


    componentWillUpdate(nextProps, nextState) {
        if (nextProps.books !== this.props.books) {
            const matchedWithShelves = this.getShelves(this.state.matched, nextProps.books)
            this.setState({ books: matchedWithShelves });
            return true
        }
    }

    updateQuery = (query) => {
        this.setState({ query: query })

        // Empty strings should return no results
        if (query.length === 0 || query === "") {
            this.setState(
                {
                    matched: [],
                    querying: false,
                    message: "Enter a search term",
                    query: ""
                },
                this.updateMessage
            )
            return
        }

        // Start the search
        this.setState(
            {
                querying: true,
                message: ""
            },
            this.updateMessage
        )

        // If search term includes query string, retrieve matching books
        BooksAPI.searchTerms.filter(t => {

            if (t.toLowerCase().includes(query.toLowerCase())) {

                BooksAPI.search(query.toLowerCase(), 20).then(rsp => {

                    // Search term not found
                    if (rsp.hasOwnProperty('error')) {
                        setTimeout(() => {
                            this.setState(
                                {
                                    matched: [],
                                    querying: false,
                                    message: "Invalid Search Term",
                                },
                                this.updateMessage
                            )
                        }, 2000)
                    } else {
                        const matchedWithShelves = this.getShelves(rsp)

                        setTimeout(() => {
                            this.setState(
                                {
                                    matched: matchedWithShelves,
                                    querying: true,
                                    message: ""
                                },
                                this.updateMessage
                            )
                        }, 3000)
                    }
                })
            }
        })
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
                            onChange={(event) => this.updateQuery(event.target.value)} />
                    </div>
                </div>

                <div className="search-books-results">
                    <ol className="books-grid"></ol>
                </div>

                <ListBooks
                    message={this.state.message}
                    updateShelves={this.props.updateShelves}
                    books={this.state.query === "" ? [] : this.state.matched} />
            </div>
        )
    }
}

export default SearchBooks