let userLibrary = [];
let newBook;
let bookIndex;
let sortBy = "dateAdded";

class Book {
    constructor(title, author, numPages, haveRead, cover, dateAdded) {
        this.title = title;
        this.author = author;
        this.numPages = numPages;
        this.haveRead = haveRead;
        this.cover = cover;
        this.dateAdded = dateAdded;           
    }
}

function retrieveStorage() {
    if(localStorage.getItem("sortBy")) {
        sortBy = localStorage.getItem("sortBy");
        document.getElementById(sortBy).setAttribute("selected", "selected");
    }
    let booksToBeAdded = JSON.parse(localStorage.getItem("userLibrary"));
    booksToBeAdded.forEach((book, index) => {
        let bookDiv = document.createElement("div");
        let bookCover = document.createElement("button");

        newBook = new Book(book.title, book.author, book.numPages, book.haveRead, book.cover, book.dateAdded);
        userLibrary.push(newBook);
        styleBookCover(bookCover);
        addCoverToDOM(bookDiv, bookCover, index);
        addClickEvent(bookDiv, bookCover);
        resizeShelf();
    });
}

if(localStorage.getItem("userLibrary")) retrieveStorage();
else document.getElementById("add-book-div").setAttribute("data-arrPos", "0");

function addBookToList() {
    let title = document.getElementById("btitle").value;
    let author = document.getElementById("bauthor").value;
    let numPages = document.getElementById("bpages").value;
    let haveRead;
    if(document.getElementById("bfinished").checked) haveRead = "Completed";
    else haveRead = "In Progress";
    let cover = document.getElementById("bcover").value;
    let dateAdded = new Date();
    newBook = new Book(title, author, numPages, haveRead, cover, dateAdded);
    userLibrary.push(newBook);
    localStorage.setItem("userLibrary", JSON.stringify(userLibrary));
}

function abbTitle() {
    let titleArr = newBook.title.split(" ");
        let titleAbbArr = titleArr.map(word => {
            return word.substring(0,1);
        });
    return titleAbbArr.join("");
}

function changeCoverColor(bookCover, book) {
    let coverColor;
    if(book.haveRead === "Completed") coverColor = "rgb(7, 102, 27)";
    else coverColor = "rgb(143, 13, 13)";
    bookCover.style.backgroundColor = `${coverColor}`;
    localStorage.setItem("userLibrary", JSON.stringify(userLibrary));
}

function styleBookCover(bookCover) {
    if (newBook.cover === "") {
        changeCoverColor(bookCover, newBook);

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

function addAndUpdateArrPos(bookDiv, index) {
    let bookDivs = document.getElementsByClassName("book-div");
    for(let i = index; i < bookDivs.length; i++) {
        let originalPos = parseInt(bookDivs[i].getAttribute("data-arrPos"));
        bookDivs[i].setAttribute("data-arrPos", `${originalPos + 1}`);
    }
    document.querySelector("#book-holder").insertBefore(bookDiv, bookDivs[index]);
    bookDiv.setAttribute("data-arrPos", `${index}`);
}

function addCoverToDOM(bookDiv, bookCover, index) {
    bookDiv.classList.add("book-div");
    bookCover.classList.add("book-cover");
    bookDiv.append(bookCover);
    addAndUpdateArrPos(bookDiv, index)
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

function addClickEvent(bookDiv, bookCover) {
    bookCover.addEventListener("click", e => {
        let currentBook = userLibrary[parseInt(bookDiv.getAttribute("data-arrPos"))];
        displayBookInfo(currentBook);
    })
}

function addShelfDiv(parentNode) {
    let shelfPosDiv = document.createElement("div");
    let shelfDiv = document.createElement("div");
    shelfPosDiv.classList.add("book-shelf-positioning");
    shelfDiv.classList.add("book-shelf");
    shelfPosDiv.appendChild(shelfDiv);
    parentNode.appendChild(shelfPosDiv);
}

function resizeShelf() {
    let bookDivs = document.getElementsByClassName("book-div");
    let windowLength = window.innerWidth * 0.9;
    let coverLength = document.getElementById("add-book-div").offsetWidth;
    let booksPerRow = Math.floor(windowLength/coverLength);
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
    let bookCover = document.createElement("button");

    addBookToList();
    if (sortBy !== "dateAdded") sortBooks();
    styleBookCover(bookCover);
    let index = userLibrary.indexOf(newBook);
    addCoverToDOM(bookDiv, bookCover, index);
    addClickEvent(bookDiv, bookCover);
    resizeShelf();
}

function blurAndBlock() {
    document.getElementById("blurred-background").style.filter = "blur(5px)";
    document.getElementById("block-other-elements").style.zIndex = "0";
}

function stopBlurAndBlock() {
    document.getElementById("blurred-background").style.filter = "none";
    document.getElementById("block-other-elements").style.zIndex = "-1";
}

document.getElementById("add-book-btn").addEventListener("click", e => {
    blurAndBlock();
    document.querySelector("form").style.display = "block";
});

document.getElementById("cancel-form-btn").addEventListener("click", e => {
    stopBlurAndBlock();
    document.querySelector("form").style.display = "none";
});

document.getElementById("exit-info-btn").addEventListener("click", e => {
    stopBlurAndBlock()
    document.getElementById("book-info").style.display = "none";
}); 

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
        let currentArrPos = parseInt(bookDivs[i].getAttribute("data-arrPos"));
        bookDivs[i].setAttribute("data-arrPos", `${currentArrPos - 1}`);
    }
    localStorage.setItem("userLibrary", JSON.stringify(userLibrary));
}

document.getElementById("delete-entry-btn").addEventListener("click", e => {
    findCurrentBook();
    deleteCurrentBook();
    resizeShelf();
    stopBlurAndBlock();
    document.getElementById("book-info").style.display = "none";
})

function reverseStatus(currentBook) {
    if (currentBook.haveRead === "Completed") currentBook.haveRead = "In Progress";
    else currentBook.haveRead = "Completed";
    document.getElementById("status-info").textContent = `${currentBook.haveRead}`;
    localStorage.setItem("userLibrary", JSON.stringify(userLibrary));
}

function moveBook(currentBook) {
    sortBooks();
    let newIndex = userLibrary.indexOf(currentBook);
    let bookDivs = document.getElementsByClassName("book-div");
    let startIndex;
    let endIndex;
    let insertIndex;
    if(newIndex > bookIndex) {
        num = -1;
        startIndex = bookIndex;
        endIndex = newIndex;
        insertIndex = newIndex + 1;
    }
    else {
        num = 1;
        startIndex = newIndex + 1;
        endIndex = bookIndex + 1;
        insertIndex = newIndex;
    }
    document.querySelector("#book-holder").insertBefore(bookDivs[bookIndex], bookDivs[insertIndex]);
    bookDivs[newIndex].setAttribute("data-arrPos", `${newIndex}`);
    for(let i = startIndex; i < endIndex; i++) {
        let originalPos = parseInt(bookDivs[i].getAttribute("data-arrPos"));
        bookDivs[i].setAttribute("data-arrPos", `${originalPos + num}`);
    }
}

document.getElementById("toggle-status-btn").addEventListener("click", e => {
    findCurrentBook();
    let currentBook = userLibrary[bookIndex];
    reverseStatus(currentBook);
    changeCoverColor(document.getElementsByClassName("book-cover")[bookIndex], userLibrary[bookIndex]);
    if(sortBy === "haveRead") {
        moveBook(currentBook);
        resizeShelf();
    }
});

let form = document.getElementById("new-book-form");

form.onsubmit = (e => {
    e.preventDefault();
    addBookToLibrary();
    form.reset();
    stopBlurAndBlock();
    document.querySelector("form").style.display = "none";
});

window.addEventListener("resize", e => {
    resizeShelf();
});

document.getElementById("clear-btn").addEventListener("click", e => {
    document.getElementById("clear-warning").style.display = "block";
    blurAndBlock();
});

document.getElementById("exit-warning-btn").addEventListener("click", e => {
    document.getElementById("clear-warning").style.display = "none";
    stopBlurAndBlock();
});

document.getElementById("clear-confirm-btn").addEventListener("click", e => {
    localStorage.clear();
    location.reload();
});

function sortABC(value) {
    userLibrary.sort((a, b) => {
        if(a[value] < b[value]) return -1;
        else if (a[value] > b[value]) return 1;
        else return 0;
    });
}

function sortDate() {
    userLibrary.sort((a, b) => {
        return Date.parse(a.dateAdded) - Date.parse(b.dateAdded);
    });
}

function sortBooks() {
    if(sortBy === "dateAdded") sortDate();
    else sortABC(sortBy);
    localStorage.setItem("userLibrary", JSON.stringify(userLibrary));
    localStorage.setItem("sortBy", sortBy);
}

document.getElementById("sort").addEventListener("change", e => {
    sortBy = e.target.value;
    sortBooks();
    location.reload();
});