import React, { Component } from 'react';
import ListBooks from './ListBooks';
import PropTypes from 'prop-types';

class Shelf extends Component {
    static propTypes = {
        books: PropTypes.array.isRequired,
        updateShelves: PropTypes.func.isRequired
    }

    message = 'no books currently on shelf'

    render() {
        return (
            <div>
                <h2 className='bookshelf-title'>{this.props.name}</h2>
                <ListBooks
                    books={this.props.books}
                    message={this.message}
                    updateShelves={this.props.updateShelves}
                />
            </div>
        )
    }
}

export default Shelf;