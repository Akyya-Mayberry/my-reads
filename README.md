# MyReads Project

This application displays virtual book shelves. It allows placing and storing books in one of 3 shelves _'Currently Reading'_, _'Reading'_, or _'Read'_. It also includes a search feature that allows querying for specific books to add to a shelf, or to update the shelf the book is on.

## Run The App

To get started developing right away or to use the app:

* install all project dependencies with `npm install`
* start the development server with `npm start`
* the application should open in your default web browser, if not it's recommended to open Chrome browser and view the app at *http://localhost:3000/*

## How to use the app
* Begin by searching for books to add to your shelves
* Click the plus icon to open up the search page
* Enter any of the valid search terms listed in [SEARCH_TERMS.md](SEARCH_TERMS.md)
* When finding a book of interest, click the arrow button on the book to open the shelf changer and select the shelf to place it on
* From that point on, any time you wish to update a book's on the shelf clicked the book shelf changer icon either in the shelves page or search page

## What You're Getting
```bash
├── CONTRIBUTING.md
├── README.md - This file.
├── SEARCH_TERMS.md # The whitelisted short collection of available search terms to use with this app.
├── package.json # npm package manager file.
├── public
│   ├── favicon.ico # React Icon
│   └── index.html # DO NOT MODIFY
└── src
    ├── App.css # Styles for app. 
    ├── App.js # This is the root of the app. 
    ├── App.test.js # Used for testing. Provided with Create React App. 
    ├── BooksAPI.js # A JavaScript API for the provided Udacity backend. Instructions for the methods are below.
    ├── icons # Helpful images for the app. 
    │   ├── add.svg
    │   ├── arrow-back.svg
    │   └── arrow-drop-down.svg
    ├── index.css # Global styles. 
    └── index.js # This file should not be modified. It is used for DOM rendering only.
```

## Backend Server

The provided file [`BooksAPI.js`](src/BooksAPI.js) contains the methods you will need to perform necessary operations on the backend:

* [`getAll`](#getall)
* [`update`](#update)
* [`search`](#search)

### `getAll`

Method Signature:

```js
getAll()
```

* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* This collection represents the books currently in the bookshelves in your app.

### `update`

Method Signature:

```js
update(book, shelf)
```

* book: `<Object>` containing at minimum an `id` attribute
* shelf: `<String>` contains one of ["wantToRead", "currentlyReading", "read"]  
* Returns a Promise which resolves to a JSON object containing the response data of the POST request

### `search`

Method Signature:

```js
search(query)
```

* query: `<String>`
* Returns a Promise which resolves to a JSON object containing a collection of a maximum of 20 book objects.


## Important
The backend API uses a fixed set of cached search results and is limited to a particular set of search terms, which can be found in [SEARCH_TERMS.md](SEARCH_TERMS.md). That list of terms are the _only_ terms that will work with the backend, so don't be surprised if your searches for Basket Weaving or Bubble Wrap don't come back with any results.

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Contributing

No contributions are being accepted at this time.

## Acknowledgements

This project design and CSS is attributed to Udacity
