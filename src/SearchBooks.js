import React, { Component } from 'react'
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

    timer = null
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

    updateQuery = async function (query) {
        if (this.timer) { clearTimeout(this.timer) }

        this.setState({ query: query })

        // Empty strings should return no results
        if (query.length === 0 || query === "") {
            this.setState(
                {
                    matched: [],
                    querying: false,
                },
                this.updateMessage
            )
            return
        }

        // Start the search
        this.setState(
            {
                querying: true
            },
            this.updateMessage
        )

        // If search term includes query string, retrieve matching books
        const found = await BooksAPI.searchTerms.filter(t => {

            if (t.toLowerCase().includes(query.toLowerCase())) {
                console.log("search term that matches: ", t)

                return BooksAPI.search(query.toLowerCase(), 100).then(rsp => {

                    // Search term not found
                    if (rsp.hasOwnProperty('error')) {
                        this.timer = setTimeout(() => {
                            this.setState(
                                {
                                    matched: [],
                                    querying: false,
                                },
                                this.updateMessage
                            )
                        }, 2000)
                        return false
                    } else {
                        const matchedWithShelves = this.getShelves(rsp)

                        this.timer = setTimeout(() => {
                            this.setState(
                                {
                                    matched: matchedWithShelves,
                                    querying: true,
                                },
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
                {
                    matched: [],
                    querying: false
                },
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