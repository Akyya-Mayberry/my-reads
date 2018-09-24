import * as BooksAPI from './BooksAPI';
import React, { Component } from 'react';
import Book from './Book';
import PropTypes from 'prop-types';

class ListBooks extends Component {

    static propTypes = {
        books: PropTypes.array.isRequired,
        message: PropTypes.string.isRequired,
        updateShelves: PropTypes.func.isRequired
    }

    /**
     * Alert parent of shelf update
     * @param {object} book - book to update shelf
     * @param {string} shelf - name of shelf to update book to
     * @return {null} - implicit null
     */
    changeShelf = (book, shelf) => {
        BooksAPI.update(book, shelf).
            then(() => {
                book.shelf = shelf;
                this.props.updateShelves();
            });
    }

    render() {

        return (
            <div className='bookshelf-books'>
                <ol className='books-grid'>
                    {
                        this.props.books.length > 0
                            ? this.props.books.map((book) =>
                                <li key={book.id}>
                                    <Book book={book} update={this.changeShelf} />
                                </li>)
                            : <p>{this.props.message}</p>
                    }
                </ol>
            </div>
        );
    }


}

export default ListBooks;