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
        books: [],
        message: ""
    }

    getShelves = (matchedBooks = [], books = []) => {
        debugger;
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

            console.log("matched book")
            return onShelf[0] || matchedBook
        })

        return matchedWithShelves
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.matched.length === 0 && !this.state.querying && this.state.query !== "") {
            this.setState({message: 'Incorrect Search Term'})
        }

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
                this.setState({ querying: true })
                BooksAPI.search(query.toLowerCase(), 20).then(rsp => {
                    let books
                    if (rsp.hasOwnProperty('error')) {
                        this.setState({ matched: [] })
                    } else {
                        books = rsp

                        console.log('books found: ', books)
                        debugger;
                        const matchedWithShelves = this.getShelves(books)
                        // this.setState({ books: matchedWithShelves })
                        this.setState({ matched: matchedWithShelves })
                    }
                    this.setState({ querying: false })

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

                {
                    
                    this.state.matched.length === 0 && !this.state.querying && this.state.query !== "" ?
                        (
                            <p>Incorrect Search Term</p>
                        ) :
                        (
                            <ListBooks
                                updateShelves={this.props.updateShelves}
                                books={this.props.query === "" ? [] : this.state.matched} />
                        )
                }
            </div>
        )
    }
}

export default SearchBooks