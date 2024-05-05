const {nanoid} = require("nanoid")
const books = require('./books')


// get all
const getBooksHandler = (request,h) => {
    const { name, reading, finished } = request.query;
    // query name
    let filteredBooks = books;
    if (name) {
        filteredBooks = filteredBooks.filter(book =>
            book.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    // query reading
    if(reading){
        if(reading == 0 || reading == 1){
            filteredBooks = filteredBooks.filter(book => book.reading === Boolean(parseInt(reading)))
        }
    }

    // query finished
    if(finished){
        if(finished == 0 || finished == 1){
            filteredBooks = filteredBooks.filter(book => book.finished === Boolean(parseInt(finished)))
        }
    }

    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map(book => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
            }))
        }
    }).code(200);

    return response;
}

//add book
const addBooksHandler = (request,h) =>{
    const id = nanoid(16)
    const {
        name, year,author,summary,publisher,pageCount,readPage, reading
    } = request.payload
    const finished = readPage === pageCount

    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    
    const newBook = {
        id, name,year,author,summary,publisher,pageCount,readPage,finished,reading, insertedAt, updatedAt
    }   
    
    // name validation
    if (!name) {
    return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400)
    }

    //read page validation
    if (readPage > pageCount) {
        return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400)
    }

    books.push(newBook)
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
        bookId: id
        }
    }).code(201)

    return response
}

const getBooksByIdHandler = (request, h) => {
    const {bookId} = request.params
    const book = books.filter((n) => n.id === bookId)[0]

    if(book !== undefined){
        return h.response({
            status:"success",
            data:{
                book
            }
        }).code(200)
    }


    const response = h.response({
            status:"fail",
            message:"Buku tidak ditemukan"
        }).code(404)

    return response
}

const editBookByIdHandler = (request, h) =>{
    const {bookId} = request.params
    const {
        name, year,author,summary,publisher,pageCount,readPage, reading
    } = request.payload
    const updatedAt = new Date().toISOString()

    // name validation
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400)
    }

    // read page validation
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400)
    }

    // if no book
    const index = books.findIndex((book) => book.id=== bookId)
    if (index === -1){
        return h.response({
            status:'fail',
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        }).code(404)
    }


    // edit selected  book by id
    books[index] = {
        ...books[index],
        name, 
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage, 
        reading,
        updatedAt
    }

    const response = h.response({
        status:'success',
        message:'Buku berhasil diperbarui'
    }).code(200)

    return response
    


}

const deleteBookByIdHandler = (request, h) =>{
    const {bookId} = request.params
    const index = books.findIndex((book) => book.id === bookId)


    // if any book
    if(index !== -1){
        books.splice(index,1)
        const responsse = h.response({
            status:'success',
            message:'Buku berhasil dihapus'
        }).code(200)

        return responsse
    }

    //if no book
    const response = h.response({
        status:'fail',
        message:'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404)

    return response

}

module.exports = {
    addBooksHandler, getBooksHandler, getBooksByIdHandler, editBookByIdHandler, deleteBookByIdHandler
}