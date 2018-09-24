import * as BooksAPI from './BooksAPI';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListBooks from './ListBooks';
import PropTypes from 'prop-types';

class SearchBooks extends Component {

    constructor(props) {
        super(props);
        this.timer = null;

        this.state = {
            books: [],
            matched: [],
            message: 'Enter Search Term',
            query: '',
            querying: false
        };
        this.getBookFromShelf = this.getBookFromShelf.bind(this);
        this.shelfBooks = this.shelfBooks.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
    }

    static propTypes = {
        books: PropTypes.array.isRequired,
        updateShelves: PropTypes.func.isRequired
    }

    /**
     *
     * @param {object} book - a searched book object
     * @param {array} books - shelved books
     * @returns {object} - the book object if found or null
     */
    getBookFromShelf = (book, books) => {

        const list = books.filter((shelfedBook) => {
            return shelfedBook.id === book.id;
        });

        return list.length >= 0
            ? list[0]
            : null;

    }

    /**
     * Updates searched book results with
     * with their proper shelf
     * @param {searchedBookResults} searchedBookResults -
     * the matched books from the query
     * @param {array} books -a list of book objects to pull shelf from
     * @returns {object} - book returned from search with shelf property
     */
    shelfBooks = (searchedBookResults = [], books = []) => {
        if (searchedBookResults.length > 0) {
            return searchedBookResults.map((matchedBook) => {

                const currentBooks = books.length > 0
                    ? books
                    : this.props.books;

                // See if current match is on the shelf
                const book = this.getBookFromShelf(matchedBook, currentBooks);

                // Update shelf
                matchedBook.shelf = book
                    ? book.shelf
                    : 'none';

                return matchedBook;
            });
        }

        return [];
    }

    /**
     * Handles what message to display when use is
     * waiting for user to search, user is searching
     * or search term invalid or search return matches
     * @returns {null} - returns implicit null
     */
    updateMessage = () => {
        const { matched, querying, query } = this.state;

        // Waiting for search term, search term invalid, or searching
        if (query === '' ||
            query.length === 0) {
            this.setState({ message: 'Enter Search Term' });
        } else if (matched.length === 0 &&
            !querying &&
            query !== '') {
            this.setState({ message: 'Invalid Search Term' });
        } else if (querying) {
            this.setState({ message: 'searching...' });
        } else {
            this.setState({ message: '' });
        }
    }

    /**
     * If props change such as books,
     * this updates the matched books so they have
     * current shelf property
     * @param {object} nextProps -
     * Updated props coming from parent nextProps
     * @param {object} nextState - Updated state
     * @return {boolean} - if component should update
     */
    componentWillUpdate(nextProps) {
        if (nextProps.books !== this.props.books) {
            const matchedWithShelves = this.shelfBooks(
                this.state.matched,
                nextProps.books
            );
            this.setState({ books: matchedWithShelves });
        }

        return true;
    }

    updateQuery = async (query) => {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.setState({ query });

        // Empty strings should return no results
        if (query.length === 0 || query === '') {
            this.setState(
                {
                    matched: [],
                    querying: false
                },
                this.updateMessage
            );

            return;
        }

        // Start the search
        this.setState({ querying: true }, this.updateMessage);

        // If search term includes query string, retrieve matching books
        const found = await BooksAPI.searchTerms.filter((term) => {

            if (term.toLowerCase().includes(query.toLowerCase())) {

                return BooksAPI.search(query.toLowerCase(), 100).then((rsp) => {
                    let success = false;

                    // Search term not found
                    if ('error' in rsp) {
                        this.timer = setTimeout(() => {
                            this.setState(
                                {
                                    matched: [],
                                    querying: false
                                },
                                this.updateMessage
                            );
                        }, 2000);

                        success = false;
                    } else {
                        const matchedWithShelves = this.shelfBooks(rsp);

                        this.timer = setTimeout(() => {
                            this.setState(
                                {
                                    matched: matchedWithShelves,
                                    querying: true
                                },
                                this.updateMessage
                            );

                            success = true;

                        }, 2000);
                    }

                    return success;
                });
            }

            return null;
        });

        if (found && found.length < 1) {
            this.setState(
                {
                    matched: [],
                    querying: false
                },
                this.updateMessage
            );
        }
    }

    render() {
        return (
            <div className='search-rsp'>
                <div className='search-books-bar'>
                    <Link className='close-search'
                        to='/'>Close</Link>
                    <div className='search-books-input-wrapper'>
                        <input type='text'
                            placeholder='Search by title or author'
                            value={this.state.query}
                            onChange={(event) => this.updateQuery(event.target.value)}
                        />
                    </div>
                </div>

                <div className='search-books-results'>
                    <ol className='books-grid'></ol>
                </div>

                <ListBooks
                    message={this.state.message}
                    updateShelves={this.props.updateShelves}
                    books={this.state.query === ''
                        ? []
                        : this.state.matched}
                />
            </div>
        )
    }
}

export default SearchBooks;