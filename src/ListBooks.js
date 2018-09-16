import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ListBooks extends Component {
    static propTypes = {
        books: PropTypes.array.isRequired,
    }
    render() {

        return (

            <div className="bookshelf-books">
                <ol className="books-grid">
                    {this.props.books.map((b) => (
                        <li key={b.id}>
                            <div className="book">
                                <div className="book-top">

                                    {/* Book Cover */}
                                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${b.imageLinks.smallThumbnail})` }}></div>

                                    {/* TODO: 
                                        Consider moving book shelf changer to component.
                                    */}

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
                        </li>))}
                </ol>
            </div>
        )
    }


}

export default ListBooks