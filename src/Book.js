import React, { Component } from 'react'

class Book extends Component {

    divStyle = {
        width: 128,
        height: 193,
        backgroundImage: this.getImage(this.props.book)
    }

    getImage(book) {
        if ('imageLinks' in book) {
            return `url(${book.imageLinks.smallThumbnail})`
        } else {
            return "url(../public/noBookImg.jpg)"
        }
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

export default Book