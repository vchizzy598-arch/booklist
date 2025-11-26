// Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI Constructor
function UI() {}

// Add book to list
UI.prototype.addBookToList = function (book) {
  const list = document.getElementById("book-list");

  const row = document.createElement("tr");
  row.setAttribute('data-id', book.id); // store DB id

  row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">clear</a></td>
  `;

  list.appendChild(row);
};


// Clear fields
UI.prototype.clearFields = function () {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("isbn").value = "";
};

// Show alert message 
UI.prototype.showAlert = function (message, className) {
  const div = document.createElement("div");
  div.className = `alert ${className}`;
  div.appendChild(document.createTextNode(message));

  const container = document.querySelector(".container");
  const form = document.querySelector("#book-form");

  container.insertBefore(div, form);

  // Remove after 3 seconds
  setTimeout(() => document.querySelector(".alert").remove(), 4000);
};

// Delete book
UI.prototype.deleteBook = function (target) {
  if (target.classList.contains("delete")) {
    target.parentElement.parentElement.remove();
  }
};

// FORM SUBMIT EVENT
document.getElementById("book-form").addEventListener("submit", function (e) {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  const ui = new UI();

  // VALIDATION 
  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("Please fill in all fields", "error");
  } else {
    const book = new Book(title, author, isbn);


    fetch("http://localhost:3000/add-book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(book)
    })
      .then(res => res.json())
      .then(data => {
        console.log("Response:", data);

        // Add to UI only if save was successful
        ui.addBookToList(book);
        ui.showAlert("Book Added successfully!", "success");
        ui.clearFields();
      })
      .catch(err => {
        console.error(err);
        ui.showAlert("Failed to save book to server", "error");
      });
  }

  e.preventDefault();
});

// DELETE EVENT
document.getElementById("book-list").addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    const row = e.target.parentElement.parentElement;
    const isbn = row.children[2].textContent.trim();

    fetch(`http://localhost:3000/delete-book/${isbn}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          ui.showAlert(data.error, "error");
        } else {
          row.remove(); 
          ui.showAlert("Book Removed successfully", "success");
        }
      })
      .catch(err => {
        console.error(err);
        ui.showAlert("Failed to delete book from server", "error");
      });
  }
});
