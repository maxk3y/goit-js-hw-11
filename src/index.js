import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputForm = document.querySelector('#search-form input');
const submitBtn = document.querySelector('#search-form button');

const APIKey = '32717144-c9c12528c9efd519e8f1db4c2';

function getUrl(params) {
  const urlFormat = 'https://pixabay.com/api?';
  return (
    urlFormat +
    Object.entries(params)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')
  );
}

inputForm.oninput = function () {
  submitBtn.disabled = inputForm.value == '';
};

submitBtn.onclick = function () {
  const url = getUrl({ key: APIKey, q: inputForm.value });
  console.log('Sending request');
  axios.get().then(res => {
    console.log(res);
  });
};
