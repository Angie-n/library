let userLibrary = [];
let newBook;
document.getElementById("add-book-div").setAttribute("data-arrPos", "0");

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

function abbTitle() {
    let titleArr = newBook.title.split(" ");
        let titleAbbArr = titleArr.map(word => {
            return word.substring(0,1);
        });
    return titleAbbArr.join("");
}

function changeCoverColor(bookCover) {
    let coverColor;
    if(newBook.haveRead === "Completed") coverColor = "rgb(7, 102, 27)";
    else coverColor = "rgb(143, 13, 13)";
    bookCover.style.backgroundColor = `${coverColor}`;
}

function styleBookCover(bookCover) {
    if (newBook.cover === "") {
        changeCoverColor(bookCover);

        let titleP = document.createElement("p");
        let authorP = document.createElement("p");
        titleP.classList.add("cover-title");
        authorP.classList.add("cover-author");
        if(newBook.title.length < 50) titleP.textContent = `${newBook.title}`;
        else {
            let titleAbb = abbTitle();
            titleP.textContent = titleAbb;
        }
        authorP.textContent = `${newBook.author}`;
        bookCover.append(titleP);
        bookCover.append(authorP);
    }
    else {
        bookCover.style.background = `url("${newBook.cover}")`;
        bookCover.style.backgroundSize = "100% 100%";
    }
}

function addCoverToDOM(bookDiv, bookCover) {
    bookDiv.classList.add("book-div");
    bookCover.classList.add("book-cover");
    bookDiv.append(bookCover);
    document.querySelector("#book-holder").insertBefore(bookDiv, document.querySelector("#add-book-div"));
}

function displayBookInfo(currentBook) {
    document.getElementById("book-info").style.display = "block";
    document.getElementById("blurred-background").style.filter = "blur(5px)";
    document.getElementById("block-other-elements").style.zIndex = "0";
    document.getElementById("title-info").textContent = `${currentBook.title}`;
    document.getElementById("author-info").textContent = `${currentBook.author}`;
    document.getElementById("pages-info").textContent = `${currentBook.numPages}`;
    document.getElementById("status-info").textContent = `${currentBook.haveRead}`;
}

function addClickEvent(bookDiv) {
    bookDiv.setAttribute("data-arrPos", `${userLibrary.length - 1}`);
    document.getElementById("add-book-div").setAttribute("data-arrPos", `${userLibrary.length}`);
    bookDiv.addEventListener("click", e => {
        let currentBook = userLibrary[parseInt(bookDiv.getAttribute("data-arrPos"))];
        displayBookInfo(currentBook);
    })
}

let bookDivs;
let windowLength;
let coverLength;
let booksPerRow;

function resizeShelf() {
    bookDivs = document.getElementsByClassName("book-div");
    windowLength = window.innerWidth * 0.9;
    coverLength = document.getElementById("add-book-div").offsetWidth;
    booksPerRow = Math.floor(windowLength/coverLength);
    for (let i = 0; i < bookDivs.length; i++) {
        let nthPos = bookDivs[i].getAttribute("data-arrPos");
        let frAfterFb = false;
        if(nthPos < booksPerRow && nthPos != 0) frAfterFb = true;
        if (nthPos % booksPerRow === 0 && !frAfterFb && bookDivs[i].childElementCount === 1) addShelfDiv(bookDivs[i]);
        else if((nthPos % booksPerRow !== 0 || frAfterFb) && bookDivs[i].childElementCount > 1) bookDivs[i].removeChild(bookDivs[i].children[1]);
    }
}

function addBookToLibrary() {
    let bookDiv = document.createElement("div");
    let bookCover = document.createElement("div");

    addBookToList();
    styleBookCover(bookCover);
    addCoverToDOM(bookDiv, bookCover);
    addClickEvent(bookDiv);
    resizeShelf();
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

let bookIndex; 

function findCurrentBook() {
    userLibrary.forEach((book, index) => {
        if(book.title === document.getElementById("title-info").textContent &&
        book.author === document.getElementById("author-info").textContent &&
        book.numPages === document.getElementById("pages-info").textContent &&
        book.haveRead === document.getElementById("status-info").textContent) {
            bookIndex = index;
        }
    })
}

function deleteCurrentBook() {
    userLibrary.splice(bookIndex, 1);
    document.getElementById("book-holder").removeChild(document.getElementsByClassName("book-div")[bookIndex]);
    let bookDivs = document.getElementsByClassName("book-div");
    for (let i = bookIndex; i < bookDivs.length; i++) {
        let currentArrPos = bookDivs[i].getAttribute("data-arrPos");
        bookDivs[i].setAttribute("data-arrPos", `${currentArrPos - 1}`);
    }
}

document.getElementById("delete-entry-btn").addEventListener("click", e => {
    findCurrentBook();
    deleteCurrentBook();
    resizeShelf();
    document.getElementById("blurred-background").style.filter = "none";
    document.getElementById("block-other-elements").style.zIndex = "-1";
    document.getElementById("book-info").style.display = "none";
})

function reverseStatus() {
    let currentBook = userLibrary[bookIndex];
    if (currentBook.haveRead === "Completed") currentBook.haveRead = "In Progress";
    else currentBook.haveRead = "Completed";
    document.getElementById("status-info").textContent = `${currentBook.haveRead}`;
}

document.getElementById("toggle-status-btn").addEventListener("click", e => {
    findCurrentBook();
    reverseStatus();
    changeCoverColor(document.getElementsByClassName("book-cover")[bookIndex]);
});

let form = document.getElementById("new-book-form");

form.onsubmit = (e => {
    e.preventDefault();
    addBookToLibrary();
    form.reset();
    document.getElementById("blurred-background").style.filter = "none";
    document.querySelector("form").style.display = "none";
    document.getElementById("block-other-elements").style.zIndex = "-1";
});

function addShelfDiv(parentNode) {
    let shelfPosDiv = document.createElement("div");
    let shelfDiv = document.createElement("div");
    shelfPosDiv.classList.add("book-shelf-positioning");
    shelfDiv.classList.add("book-shelf");
    shelfPosDiv.appendChild(shelfDiv);
    parentNode.appendChild(shelfPosDiv);
}

window.addEventListener("resize", e => {
    resizeShelf();
});
