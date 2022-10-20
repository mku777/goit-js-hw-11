import fetch from './js/fetch';
import markupImageCard from './js/markup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const gallery = document.querySelector('.gallery');

const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

searchForm.addEventListener('submit', submitSearchForm);
loadMoreBtn.addEventListener('click', clickLoadMoreBtn);

async function submitSearchForm(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.searchQuery.value.trim();
  currentPage = 1;

  if (searchQuery === '') {
    Notify.info('Sorry, you need to write something in the form');
    return;
  }

  const response = await fetch(searchQuery, currentPage);
  currentHits = response.hits.length;
  console.log(response)
  if (response.totalHits > 40) {
    loadMoreBtn.classList.remove('is-hidden');
  } 
  else {
    loadMoreBtn.classList.add('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      markupImageCard(response.hits, gallery);
      lightbox.refresh();
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function clickLoadMoreBtn() {
  currentPage += 1;
  const response = await fetch(searchQuery, currentPage);
  console.log(response)
  markupImageCard(response.hits, gallery);
  lightbox.refresh();
  currentHits += response.hits.length;
console.log(currentHits);
  if (currentHits >= response.totalHits) {
    Notify.warning(
      `We're sorry, but you've reached the end of search results.`
    );
    loadMoreBtn.classList.add('is-hidden');
  }
}
