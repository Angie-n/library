let userLibrary = [];
let bookHolder = document.querySelector("#book-holder");

function Book(author, title, numPages, haveRead) {
    this.author = author;
    this.title = title;
    this.numPages = numPages;
    this.haveRead = haveRead;
}

function addBookToLibrary() {
    userLibrary.forEach(book => {
        let bookDiv = document.createElement("div");
        bookDiv.classList.add("book-div");
        let bookCover = document.createElement("div");
        bookCover.classList.add("book-cover");
        let bookInfo = document.createElement("div");
        bookInfo.classList.add("book-info");
        bookDiv.appendChild(bookCover);
        bookDiv.appendChild(bookInfo);
        bookHolder.insertBefore(bookDiv, document.querySelector("#add-book-btn"));
    }); 
}

document.getElementById("add-book-btn").addEventListener("click", e => {
    document.getElementById("blurred-background").style.filter = "blur(2px)";
    document.querySelector("form").style.display = "block";
});

document.getElementById("cancel-btn").addEventListener("click", e => {
    document.getElementById("blurred-background").style.filter = "none";
    document.querySelector("form").style.display = "none";
});
