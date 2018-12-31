// Book Class: represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handles UI tasks
class UI {
  static displayBooks(){
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book){
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <!-- <td><a href="#" class = "btn btn-primary btn-sm update"><i class="fa fa-edit"></i></a></td> -->
      <td><a href="#" id=${book.isbn} class = "btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  /*
  static updateBook(el) {
    if(el.classList.contains('update')) {
      const book = el.parentElement.parentElement;

      document.querySelector('#title').value = book.title;
      document.querySelector('#author').value = book.author;
      document.querySelector('#isbn').value = book.isbn;

      document.querySelector('#userButton').value = "Update Book";
    }
  }
  */

  static deleteBook(el){
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    // Make vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields(){
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// Store Class: handles storage
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));

  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index,1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }

/*
  static updateBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        return book;
      }
    });
  }
*/
}


// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);


// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {

  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // Validate
  if(title === '' || author === '' || isbn === '') {
    UI.showAlert('Fill in all fields', 'danger');
  } else {

    // Instantiate book
    const book = new Book(title, author, isbn);

    // Add book to UI
    UI.addBookToList(book);

    // Add book to Store
    Store.addBook(book);

    // Show success message
    UI.showAlert('Book added', 'success');

    // Clear fields
    UI.clearFields();
  }

});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  // console.log(e.target.id);
  UI.deleteBook(e.target);

  // Remove book from store
  // Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  Store.removeBook(e.target.id);

  // Show success message
  UI.showAlert('Book removed', 'success');

});

// Event: Update a book
/* document.querySelector('#book-list').addEventListener('click', (e) => {
  UI.updateBook(e.target);
});
*/
