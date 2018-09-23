import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as BooksAPI from './BooksAPI'
import Book from './Book'

class ListBooks extends Component {

    static propTypes = {
        books: PropTypes.array.isRequired,
        message: PropTypes.string.isRequired,
        updateShelves: PropTypes.func.isRequired
    }

    /**
     * Change book's shelf and alert parent component
     */
    changeShelf = (book, shelf) => {
        BooksAPI.update(book, shelf)
            .then(bookUpdated => {
                book.shelf = shelf
                this.props.updateShelves(bookUpdated, shelf)
            })
    }

    render() {

        return (
            <div className="bookshelf-books">
                <ol className="books-grid">
                    {
                        this.props.books.length > 0 ?
                            (this.props.books.map((b) => (
                                <li key={b.id}>
                                    <Book book={b} update={this.changeShelf} />
                                </li>)))
                            :
                            <p>{this.props.message}</p>
                    }
                </ol>
            </div>
        )
    }


}

export default ListBooks