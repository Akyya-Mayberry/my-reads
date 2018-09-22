import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as BooksAPI from './BooksAPI'

// ComponentWillReceiveProps
class Book extends Component {

    getImage(book) {
        if ('imageLinks' in book) {
            return `url(${book.imageLinks.smallThumbnail})`
        } else {
            return ""
        }
    }

   divStyle = {
        width: 128, 
        height: 193, 
        backgroundImage: this.getImage(this.props.book)
    }

    render() {
        const b = this.props.book
        return (
            <div className="book">
                <div className="book-top">

                    {/* Book Cover */}
                    <div className="book-cover" style={this.divStyle}></div>

                    {/* TODO: Consider moving book shelf changer to component. */}

                    {/* Book Shelf Changer */}
                    <div className="book-shelf-changer">
                        <select value={b.shelf} onChange={(evt) => this.props.update(b, evt.target.value)}>
                            <option value="move" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                </div>
                <div className="book-title">{b.title}</div>
                <div className="book-authors">{b.authors}</div>
            </div>
        )
    }
}


class ListBooks extends Component {
    static propTypes = {
        books: PropTypes.array.isRequired,
    }

    changeShelf = (book, shelf) => {
        BooksAPI.update(book, shelf)
            .then(c => {
                // console.log('success saving book!!!!')
                // this.setState(state => ({
                //     books: this.props.books.map(b => {
                //         if (b.id === book.id) {
                //             b.shelf = shelf
                //         }
                //         return b
                //     })
                // }))
                this.props.updateShelves(book, shelf)
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
                            "no books to display"
                    }
                </ol>
            </div>
        )
    }


}

export default ListBooks