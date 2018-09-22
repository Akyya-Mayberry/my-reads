import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ListBooks from './ListBooks'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'


class SearchBooks extends Component {
    state = {
        matched: [],
        query: ""
    }

    updateShelf() {
        BooksAPI.get(this.props.book.id).then(b => {
            this.setState({ book: b })
        })
    }

    // This ensures query is empty when navigating
    // to the search page - meaning we get fresh search
    componentWillReceiveProps() {
        this.setState({ query: "" })
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
                BooksAPI.search(query.toLowerCase(), 100).then(books => {

                    /* HELP: Here is where I update search results
                    however the search endpoint doesn't return
                    book objects with shelf property. So
                    how am I to include the shelf property here?
                    */
                    this.setState({ matched: books })
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