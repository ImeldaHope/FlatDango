const url = 'http://localhost:3000/films';

document.addEventListener('DOMContentLoaded', () => {
    renderMovies()
    fetchAMovie()
})

function renderMovies(){
    const menu = document.getElementById('menu-id');    
    
    fetch(url)
    .then(res => res.json())
    .then(data => {
            
        data.map((film) => {
            const movieDiv = document.createElement('div');
            const poster = document.createElement('img');
            const title = document.createElement('h3');
            const viewBtn = document.createElement('button');

            movieDiv.id = 'menu-movie';

            poster.src = film.poster;
            title.textContent = film.title;
            
            viewBtn.textContent = 'view details';

            const id = film.id;

            viewBtn.addEventListener('click', () => {
                fetchAMovie(id);
            })

            movieDiv.append(poster,title,viewBtn);
            menu.appendChild(movieDiv)
        })                       
    })    
}

function fetchAMovie(id = 1){
    const movie = document.querySelector('.main-movie');

    movie.innerHTML = '';
    const movieDetails = document.createElement('div');
    const moviePoster = document.createElement('img');
    const movieTitle = document.createElement('h3');
    const description = document.createElement('p');
    const movieInfo = document.createElement('div');
    const showtime = document.createElement('p');
    const runtime = document.createElement('p');
    const tickets = document.createElement('p');
    const ticketBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');

    fetch(`${url}/${id}`)
    .then(res => res.json())
    .then(data => {

        moviePoster.src = data.poster;
        movieTitle.textContent = data.title;
        description.textContent = data.description;
        showtime.textContent = "Showtime: " + data.showtime;
        runtime.textContent = "Runtime: " + data.runtime;
       
        ticketBtn.textContent = 'Buy Ticket'
        deleteBtn.textContent = 'Delete'

        movieInfo.className = 'movie-info';
        movieDetails.className = 'detail-movie';

       
        
        ticketBtn.addEventListener('click',() => {
            buyTicket(data, tickets);            
        })

        tickets.textContent = `Available tickets: ${data.capacity - data.tickets_sold}`;

        deleteBtn.addEventListener('click', () =>{
            deleteMovie(data.id)
        })

        movieInfo.append(showtime, runtime, tickets);
        movieDetails.append(movieTitle, description, movieInfo, ticketBtn, deleteBtn)

        movie.append(moviePoster, movieDetails);
    })
    .catch((error) => {
        const p = document.createElement('p');
        p.textContent = error.message;

    })
}


function buyTicket(data, ticketsElement){  
    
    if (data.tickets_sold < data.capacity) {  
        // data.tickets_sold += 1; 
         
        fetch(`${url}/${data.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            body : JSON.stringify({ tickets_sold: data.tickets_sold + 1})
        })
        .then(res => res.json())
        .then((par) => {          
                
            ticketsElement.textContent = `Available tickets: ${par.capacity - par.tickets_sold}`; 
             
            // console.log(par.tickets_sold)          
        })
    }
}

function deleteMovie(id){
    fetch(`${url}/${id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'            
        }
    })  
    .then(res => res.json())
    .then(() => {
        const movie = document.querySelector('.main-movie');
        const menuItem = document.querySelector('#menu-movie');

        movie.remove(id)
        menuItem.remove(id)
    })      
}