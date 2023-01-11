import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import axios from 'axios';
import { Notify } from 'notiflix';

const inputForm = document.querySelector('#search-form input');
const submitBut = document.querySelector('#search-form button');
const imageList = document.querySelector('.gallery');
const footerDiv = document.querySelector('#footer');

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
});

const state = {
  init: false, // loaded initial hits
  finish: false, // loaded all possible hits
};

const queryParams = {
  key: '32717144-c9c12528c9efd519e8f1db4c2',
  orientation: 'horizontal',
  image_type: 'photo',
  safesearch: true,
  per_page: 20,
};

const observer = new IntersectionObserver(onReachedBottom);
observer.observe(footerDiv);

function onReachedBottom(entries) {
  entries.forEach(async entry => {
    if (entry.isIntersecting && state.init && !state.finish) {
      const hits = (await loadImages()).hits.length;
      state.finish = hits < queryParams.per_page;
      if (state.finish) {
        Notify.warning('No more results');
      }
    }
  });
}

function getImageHtml(hit) {
  return `<div class="photo-card">
            <a href="${hit.largeImageURL}"> 
                <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy">
            </a>
            <div class="info">
                <p class="info-item"> <b>Likes: </b>${hit.likes} </p>
                <p class="info-item"> <b>Views: </b>${hit.views} </p>
                <p class="info-item"> <b>Comments: </b>${hit.comments} </p>
                <p class="info-item"> <b>Downloads: </b>${hit.downloads} </p>
            </div>
        </div>`;
}

function getUrl(params) {
  return (
    'https://pixabay.com/api/?' +
    Object.entries(params)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')
  );
}

async function loadImages() {
  queryParams.page += 1;
  const url = getUrl(queryParams);
  const res = await axios.get(url);
  if (res.data.hits.length > 0) {
    imageList.innerHTML += res.data.hits.map(getImageHtml).join('\n');
    simpleLightBox.refresh();
  }
  return res.data;
}

submitBut.addEventListener('click', async function (e) {
  e.preventDefault();

  imageList.innerHTML = '';
  queryParams.page = 0;
  queryParams.q = inputForm.value;
  const hits = (await loadImages()).totalHits;
  if (hits > 0) {
    Notify.success(`Found ${hits} results`);
    state.init = true;
  } else {
    Notify.failure('No results found');
  }
});

inputForm.addEventListener('input', function (event) {
  submitBut.disabled = inputForm.value == '';
});
