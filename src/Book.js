import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Book extends Component {
    static propTypes = {
        book: PropTypes.object.isRequired,
        update: PropTypes.func.isRequired
    }

    getImage = (book) => {
        return 'imageLinks' in book
            ? `url(${book.imageLinks.smallThumbnail})`
            : `url('noBookImg.jpg')`;
    }

    divStyle = {
        backgroundImage: this.getImage(this.props.book),
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: 193,
        width: 128
    }


    render() {
        const { book, update } = this.props;

        return (
            <div className='book'>
                <div className='book-top'>

                    {/* Book Cover */}
                    <div className='book-cover' style={this.divStyle}></div>

                    {/* Consider moving book shelf changer to component. */}

                    {/* Book Shelf Changer */}
                    <div className='book-shelf-changer'>
                        <select
                            value={book.shelf}
                            onChange={(evt) => update(book, evt.target.value)}>
                            <option value='move' disabled>Move to...</option>
                            <option value='currentlyReading'>
                                Currently Reading
                            </option>
                            <option value='wantToRead'>Want to Read</option>
                            <option value='read'>Read</option>
                            <option value='none'>None</option>
                        </select>
                    </div>

                </div>
                <div className='book-title'>{book.title}</div>
                <div className='book-authors'>{book.authors}</div>
            </div>
        );
    }
}

export default Book;