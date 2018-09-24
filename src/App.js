import './App.css';
import * as BooksAPI from './BooksAPI';
import { Link, Route } from 'react-router-dom';
import React from 'react';
import SearchBooks from './SearchBooks';
import Shelf from './Shelf';

class BooksApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            books: [],
            query: ''
        };

        // These require being in proper order
        // move to an array of tuples for instance
        this.shelves = {
            currentlyReading: 'Currently Reading',
            read: 'Read',
            wantToRead: 'Want To Read'
        };

        this.updateShelves = this.updateShelves.bind(this);
    }

    // Callback for child components to alert shelf changed
    updateShelves() {
        BooksAPI.getAll().then((books) => {
            this.setState({ books });
        });
    }

    componentDidMount() {
        BooksAPI.getAll().then((books) => {
            this.setState({ books });
        });
    }

    render() {

        return (
            <div className='app'>

                {/* Search Books Link */}

                <Route exact path='/search' render={() =>
                    <SearchBooks
                        books={this.state.books}
                        updateShelves={this.updateShelves} />
                } />

                {/* Main Section - Books */}

                <Route exact path='/' render={() =>
                    <div className='list-books'>

                        {/* My Reads Header */}
                        <div className='list-books-title'>
                            <h1>MyReads</h1>
                        </div>

                        {/* The Shelves */}
                        <div className='list-books-content'>
                            <div>
                                {
                                    Object.entries(this.shelves).map(([
                                        key,
                                        val
                                    ]) =>
                                        <Shelf
                                            key={key}
                                            name={val}
                                            books={this.state.books.filter((book) =>
                                                book.shelf === key)}
                                            updateShelves={this.updateShelves}
                                        />)
                                }
                            </div>
                        </div>

                        {/* Search/Update Book Link */}
                        <div className='open-search'>
                            <Link to='/search'>Add a book</Link>
                        </div>

                    </div>
                } />

            </div>
        );
    }
}

export default BooksApp;
