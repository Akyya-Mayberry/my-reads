import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as BooksAPI from './BooksAPI'
import Book from './Book'

class ListBooks extends Component {

    static propTypes = {
        books: PropTypes.array.isRequired,
    }

    changeShelf = (book, shelf) => {
        BooksAPI.update(book, shelf)
            .then(c => {
                book.shelf = shelf
                book = c
                this.props.updateShelves(c, shelf)
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