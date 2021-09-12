let userLibrary = [];
let form = document.getElementById("new-book-form");
let newBook;

function Book(title, author, numPages, haveRead, cover) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.haveRead = haveRead;
    this.cover = cover;
}

function addBookToList() {
    let title = document.getElementById("btitle").value;
    let author = document.getElementById("bauthor").value;
    let numPages = document.getElementById("bpages").value;
    let haveRead;
    if(document.getElementById("bfinished").checked) haveRead = "Completed";
    else haveRead = "In Progress";
    let cover = document.getElementById("bcover").value;
    newBook = new Book(title, author, numPages, haveRead, cover);
    userLibrary.push(newBook);
}

function addBookCover(bookCover) {
    if (newBook.cover === "") {
        let coverColor;
        if(newBook.haveRead === "Completed") coverColor = "rgb(7, 102, 27)";
        else coverColor = "rgb(143, 13, 13)";

        let titleArr = newBook.title.split(" ");
        let titleAbbArr = titleArr.map(word => {
            return word.substring(0,1);
        });
        let coverTitle = titleAbbArr.join("");
        bookCover.style.backgroundColor = `${coverColor}`;
        bookCover.textContent = `${coverTitle}`;
    }
    else {
        bookCover.style.background = `url("${newBook.cover}")`;
        bookCover.style.backgroundSize = "100% 100%";
    }
}

function displayCover(bookDiv, bookCover, bookInfo) {
    bookDiv.classList.add("book-div");
    bookCover.classList.add("book-cover");
    bookDiv.append(bookCover);
    document.querySelector("#book-holder").insertBefore(bookDiv, document.querySelector("#add-book-div"));
}

function displayBookInfo() {
    document.getElementById("book-info").style.display = "block";
    document.getElementById("blurred-background").style.filter = "blur(5px)";
    document.getElementById("block-other-elements").style.zIndex = "0";
    document.getElementById("title-info").textContent = `${newBook.title}`;
    document.getElementById("author-info").textContent = `${newBook.author}`;
    document.getElementById("pages-info").textContent = `${newBook.numPages}`;
    document.getElementById("status-info").textContent = `${newBook.haveRead}`;
}

function addClickEvent(bookDiv) {
    bookDiv.addEventListener("click", e => {
        displayBookInfo();
    })
}

function addBookToLibrary() {
    let bookDiv = document.createElement("div");
    let bookCover = document.createElement("div");

    addBookToList();
    addBookCover(bookCover);
    displayCover(bookDiv, bookCover);
    addClickEvent(bookDiv);
}

document.getElementById("add-book-btn").addEventListener("click", e => {
    document.getElementById("blurred-background").style.filter = "blur(5px)";
    document.getElementById("block-other-elements").style.zIndex = "0";
    document.querySelector("form").style.display = "block";
});

document.getElementById("cancel-form-btn").addEventListener("click", e => {
    document.getElementById("blurred-background").style.filter = "none";
    document.getElementById("block-other-elements").style.zIndex = "-1";
    document.querySelector("form").style.display = "none";
});

document.getElementById("exit-info-btn").addEventListener("click", e => {
    document.getElementById("blurred-background").style.filter = "none";
    document.getElementById("block-other-elements").style.zIndex = "-1";
    document.getElementById("book-info").style.display = "none";
});

form.onsubmit = (e => {
    e.preventDefault();
    addBookToLibrary();
    form.reset();
    document.getElementById("blurred-background").style.filter = "none";
    document.querySelector("form").style.display = "none";
    document.getElementById("block-other-elements").style.zIndex = "-1";
});

window.addEventListener("resize", e => {

});
