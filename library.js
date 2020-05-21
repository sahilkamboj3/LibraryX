const Book = (title,author,numPages) => {
    return {title, author, numPages};
}

let addBookToLibrary = (book) => {
    bookLibrary.push(book);
};

let deleteBook = (bookTitle)  => {
    bookLibrary = bookLibrary.filter( (book) => book.title != bookTitle);
}

let render = (div) => {

    let bookHolder = document.querySelector(`.${div}`);
    bookHolder.textContent = "";

    for (book in bookLibrary) {

        let div = document.createElement('div');
        let hr = document.createElement('hr');
        let title = document.createElement('h1');
        title.classList.add('title');
        let author = document.createElement('h3');
        author.classList.add('author');
        let numPages = document.createElement('h5');
        numPages.classList.add('numPages');
        let read_btn = document.createElement('button');
        read_btn.textContent = 'Read?';
        let delete_btn = document.createElement('button');
        delete_btn.textContent = 'Remove';
        delete_btn.classList.add('delete');

        title.textContent = bookLibrary[book].title;
        author.textContent = bookLibrary[book].author;

        if (bookLibrary[book].numPages.indexOf('pg.') > -1) {
            numPages.textContent = `${bookLibrary[book].numPages}`;
        } else {
            numPages.textContent = `${bookLibrary[book].numPages} pg.`;
        }

        read_btn.addEventListener('click', () => {
            deleteBook(title.textContent);
            let cur_book = Book(title.textContent, author.textContent, numPages.textContent);
            finishedBooks.push(cur_book);
            renderFinished('finished-books-holder');
            render('book-holder');
        })

        delete_btn.addEventListener('click', () => {
            deleteBook(title.textContent);
            render('book-holder');
        })

        div.appendChild(hr);
        div.appendChild(title);
        div.appendChild(author);
        div.appendChild(numPages);
        div.appendChild(read_btn);
        div.appendChild(delete_btn);

        div.classList.add('book');

        bookHolder.appendChild(div);

    }
}

let renderFinished = (div) => {

    let finishedBooksHolder = document.querySelector(`.${div}`);
    finishedBooksHolder.textContent = "";

    for (book in finishedBooks) {

        let div = document.createElement('div');
        let hr = document.createElement('hr');
        let title = document.createElement('h1');
        title.classList.add('finished-title');
        let author = document.createElement('h3');
        author.classList.add('finished-author');
        let numPages = document.createElement('h5');
        numPages.classList.add('finished-numPages');
        let add_book_btn = document.createElement('button');
        add_book_btn.textContent = 'Unread';

        add_book_btn.addEventListener('click', () => {
            let cur_book = Book(title.textContent, author.textContent, numPages.textContent);
            addBookToLibrary(cur_book);
            let cur_title = title.textContent;
            finishedBooks = finishedBooks.filter( (book) => book.title != cur_title);
            renderFinished('finished-books-holder');
            render('book-holder');
        })

        title.textContent = finishedBooks[book].title;
        author.textContent = finishedBooks[book].author;

        if (finishedBooks[book].numPages.indexOf('pg.') > -1) {
            numPages.textContent = `${finishedBooks[book].numPages}`;
        } else {
            numPages.textContent = `${finishedBooks[book].numPages} pg.`;
        }

        div.appendChild(hr);
        div.appendChild(title);
        div.appendChild(author);
        div.appendChild(numPages);
        div.appendChild(add_book_btn);

        div.classList.add('finished_book');

        finishedBooksHolder.appendChild(div);

    }
}

const writeDate = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat']

    date = document.querySelector('#date');
    month_year = document.querySelector('#month-year');
    day = document.querySelector('#day');

    month_year.textContent = `${months[new Date().getMonth()]} ${new Date().getFullYear()}`;
    date.textContent = new Date().getDate();
    day.textContent = days[new Date().getDay()]
}

const suggestBooks = (title) => {

    fetch(`https://google-books.p.rapidapi.com/volumes?q=${title}`, { 
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "google-books.p.rapidapi.com",
            "x-rapidapi-key": "2568ecf6b9msh32072e82f13987ep1cd051jsne97f281ef94d"
        }
    })
    .then(response => { 
        return response.json(); 
    })
    .then(function(data) {

        let suggested_books = document.querySelector('#suggested-books');
        suggested_books.textContent = "";

        for (num in data.items){

            try {

                let new_book = document.createElement('div');
                new_book.classList.add('suggested_book');
                new_book.classList.add(`${data.items[num].id}`);
                
                let book_image = document.createElement('img');
                book_image.src = data.items[num].volumeInfo.imageLinks.thumbnail;

                let content = document.createElement('div')
                content.classList.add('suggested_book_content');

                let hr = document.createElement('hr');
                let title = document.createElement('a');
                title.classList.add('suggested_title');
                let author = document.createElement('h3');
                author.classList.add('suggested_author');
                let numPages = document.createElement('h5');
                numPages.classList.add('suggested_numPages');
                let add_suggested_book_btn = document.createElement('button');
                add_suggested_book_btn.textContent = 'Add book';

                if (data.items[num].volumeInfo.subtitle != undefined && data.items[num].volumeInfo.subtitle.length < 25) {
                    title.textContent = `${data.items[num].volumeInfo.title} : ${data.items[num].volumeInfo.subtitle}`;
                } else {
                    title.textContent = data.items[num].volumeInfo.title;
                }
                title.href = data.items[num].volumeInfo.previewLink;
                title.target = '_blank';

                author.textContent = data.items[num].volumeInfo.authors[0];
                numPages.textContent =`${data.items[num].volumeInfo.pageCount.toString()} pg.`;

                add_suggested_book_btn.addEventListener('click', () => {
                    let book = Book(title.textContent, author.textContent, numPages.textContent);
                    addBookToLibrary(book);
                    render('book-holder');
                })

                content.appendChild(hr);
                content.appendChild(title);
                content.appendChild(author);
                content.appendChild(numPages);
                content.appendChild(add_suggested_book_btn);

                new_book.appendChild(book_image);
                new_book.appendChild(content);

                suggested_books.appendChild(new_book);
            }
            catch (err) {
                console.log(`New Error: ${err}`);
                continue;    
            }
 
        }
    })
    .catch(err => {console.log(err);} )
}

let addBtn = document.querySelector('#add-btn');
addBtn.addEventListener('click', () => {

    let title = document.querySelector('#add-title');
    let author = document.querySelector('#add-author');
    let numPages = document.querySelector('#add-num-pages');

    if (title.value != '' && author.value != '' && numPages.value != '') {

        let newBook = Book(title.value, author.value, numPages.value);
        addBookToLibrary(newBook);
        render('book-holder');
    }

    title.value = "";
    author.value = "";
    numPages.value = "";

})

let searchBtn = document.querySelector('#search-btn');
searchBtn.addEventListener('click', () => {
    let title = document.querySelector('#search-title');
    suggestBooks(title.value);
    title.value = '';
})

writeDate();
let bookLibrary = [];
let finishedBooks = [];
suggestBooks();