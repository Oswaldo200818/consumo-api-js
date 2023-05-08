/**
 * API Key (v3 auth)
 * f200bb1c1249524e90b2a2d490b0b158
 */

/**
 * API Read Access Token (v4 auth)
 * eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjAwYmIxYzEyNDk1MjRlOTBiMmEyZDQ5MGIwYjE1OCIsInN1YiI6IjYzMjNkMWYzNTQzN2Y1MDA3ZGY0ZTkyZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Rwi43RxD7liRN9N2wveSRrFjwqXcSiqzskrpFPEGAgI
 */
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    Headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    params: {
        'api_key': API_KEY,
    },
});

//Utils
const lazyLoader = new  IntersectionObserver((entries)=>{
    entries.forEach((entry) =>{
        // console.log(entry);
        if (entry.isIntersecting) {
            
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    });
});



function createMovies(movies, container, {lazyLoad = false, clean = true}={}) {
    if(clean){
        container.innerHTML = "";
    }

    movies.forEach(movie => {
 

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        movieContainer.addEventListener('click', () =>{
            location.hash = '#movie=' + movie.id;
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path,
            );
            if (lazyLoad) {
                lazyLoader.observe(movieImg);
            }
            
        movieImg.addEventListener('error', ()=>{
            movieImg.setAttribute('src', '/image/reyLeon.jpg')
        });

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}

function createCategories(categories, container) {
    container.innerHTML = "";

    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id'+ category.id);
        categoryTitle.addEventListener('click', ()=>{
            location.hash=`#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}


//call a API
async function getTrendingMoviesPreview() {
    // const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
    // const data = await res.json();
    const {data} = await api('trending/movie/day');
    const movies = data.results;
    
    createMovies(movies, trendingMoviesPreviewList, true);
}


async function getCategoriesPreview() {
    // const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY);
    // const data = await res.json();
    const {data} = await api('genre/movie/list');
    const categories = data.genres; 
    //categoriesPreviewList.innerHTML = ""; 

    createCategories(categories, categoriesPreviewList);

}

async function getMoviesByCategory(id) {
    const {data} = await api('/discover/movie',{
        params:{
            with_genres: id,
        },
    });
    const movies = data.results;

    createMovies(movies, genericSection, true);
    
}

async function getMoviesBySearch(query) {
    const {data} = await api('search/movie',{
        params:{
          query,
        },
    });
    const movies = data.results;

    createMovies(movies, genericSection);
    
}

async function getTrendingMovies() {
    // const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
    // const data = await res.json();
    const {data} = await api('trending/movie/day');
    const movies = data.results;
    
    createMovies(movies, genericSection, {lazyLoad: true, clean: true},);

    const btnLoadMore = document.createElement('button');
    btnLoadMore.innerText = 'Cargar más';
    btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    genericSection.appendChild(btnLoadMore);
}

let page=1;
async function getPaginatedTrendingMovies(){
    page++;
    const {data} = await api('trending/movie/day',{
        params: {
            page,
        },
    });
    const movies = data.results;
    
    createMovies(movies, genericSection, {lazyLoad: true, clean: false},);

    const btnLoadMore = document.createElement('button');
    btnLoadMore.innerText = 'Cargar más';
    btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    genericSection.appendChild(btnLoadMore);

}

async function getMovieById(id) {
    // const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
    // const data = await res.json();
    const {data: movie} = await api('movie/' + id);

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    console.log(movieImgUrl);
    headerSection.style.background = `
    linear-gradient(
        180deg,
        rgba(0,0,0,0.35)19.27%,
        rgba(0,0,0,0)29.17%
    ),
    
    url(${movieImgUrl})
    `;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesById(id);
}


async function getRelatedMoviesById(id) {
    const {data} = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);
}