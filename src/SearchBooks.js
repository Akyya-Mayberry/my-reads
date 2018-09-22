import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ListBooks from './ListBooks'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'


class SearchBooks extends Component {
    state = {
        matched: [],
        query: "",
        books: []
    }

    getShelves = (matchedBooks, books = []) => {
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

            console.log("matched book")
            return onShelf[0] || matchedBook
        })

        return matchedWithShelves
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.books != this.props.books) {
            const matchedWithShelves = this.getShelves(this.state.matched, nextProps.books)
            // this.setState({ matched: matchedWithShelves });
            this.setState({ books: matchedWithShelves });

        }
    }

    updateQuery = (query) => {

        this.setState({ query: query })

        // Empty strings should return no results
        if (query.length === 0 || query === "") {
            this.setState({ matched: [] })
            return
        }

        // If search term includes query string, retrieve matching books
        BooksAPI.searchTerms.filter(t => {
            if (t.toLowerCase().includes(query.toLowerCase())) {
                BooksAPI.search(query.toLowerCase(), 20).then(books => {

                    const matchedWithShelves = this.getShelves(books)

                    // this.setState({ books: matchedWithShelves })
                    this.setState({ matched: matchedWithShelves })

                })
            } else {
                this.setState({ matched: [] })
            }
        })
    }

    render() {
        return (
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
                    updateShelves={this.props.updateShelves}
                    books={this.props.query === "" ? [] : this.state.matched} />

            </div>
        )
    }
}

export default SearchBooks