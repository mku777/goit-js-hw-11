import fetch from "./js/fetch";
import markupImageCard from './js/markup'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});


const gallery = document.querySelector('.gallery');
const endText = document.querySelector('.end-text');
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
    Notify.info("Sorry, you need to write something in the form")
    return;
  }

  const response = await fetch(searchQuery, currentPage);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    loadMoreBtn.classList.remove('is-hidden');
    endText.classList.add('is-hidden');
  } else {
    loadMoreBtn.classList.add('is-hidden');
    endText.classList.remove('is-hidden');
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
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadMoreBtn.classList.add('is-hidden');
      endText.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function clickLoadMoreBtn() {
    currentPage += 1;
    const response = await fetch(searchQuery, currentPage);
    markupImageCard(response.hits, gallery);
    lightbox.refresh();
    currentHits += response.hits.length;
  
    if (currentHits === response.totalHits) {
      loadMoreBtn.classList.add('is-hidden');
      endCollectionText.classList.remove('is-hidden');
    }
  }



