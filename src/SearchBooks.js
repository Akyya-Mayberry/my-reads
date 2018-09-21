import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ListBooks from './ListBooks'
import { Link } from 'react-router-dom'


class SearchBooks extends Component {
    componentDidMount() {
        this.props.updateQuery("")
    }

    render() {
        return (
            // TODO: Move search to a component
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className="close-search"
                        to="/">Close</Link>
                    <div className="search-books-input-wrapper">
                        <input type="text"
                            placeholder="Search by title or author"
                            value={this.props.query}
                            onChange={(event) => this.props.updateQuery(event.target.value)} />

                    </div>
                </div>

                <div className="search-books-results">
                    <ol className="books-grid"></ol>
                </div>

                <ListBooks
                    updateShelves={this.props.update}
                    books={this.props.query === "" ? [] : this.props.matched} />

            </div>
        )
    }
}

export default SearchBooks