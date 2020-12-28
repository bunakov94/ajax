const searchResult = document.querySelector('.search__result');
const favoriteList = document.querySelector('.favorite-list');

const debounce = (fn, debounceTime = 0) => {
  let timeout;

  return function wrapper() {
    const context = this;
    const args = arguments;

    const deferredCall = function () {
      fn.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(deferredCall, debounceTime);
  };
};
function removeItemFromFavorite(context) {
  context.parentElement.remove();
}
function renderSearchResult({ items }) {
  for (const {
    name,
    stargazers_count: star,
    owner: { login },
  } of items) {
    const searchResultItem = document.createElement('button');
    searchResultItem.classList.add('result-item');
    searchResultItem.textContent = `${name}`;
    searchResultItem.onclick = () => addItemToFavorite({ name, star, login });
    searchResult.appendChild(searchResultItem);
  }
}
function addItemToFavorite({ name, star, login }) {
  const newFavoriteItem = document.createRange().createContextualFragment(
    `<div class="favorite-list__item">
        <div>
          <p>Name: ${name}</p>
          <p>Owner: ${login}</p>
          <p>Stars: ${star}</p>
      </div>
      <button class="delete" onClick="removeItemFromFavorite(this)"><img src="close.png" class="delete__img"></button>
    </div>`
  );
  favoriteList.append(newFavoriteItem);
  input.value = '';
  searchResult.innerHTML = '';
}
const getData = debounce(async function () {
  searchResult.innerHTML = '';
  try {
    if (input.value.length > 0) {
      await fetch(
        `https://api.github.com/search/repositories?q=${this.value}&per_page=5`
      )
        .then((res) => res.json())
        .then((res) => renderSearchResult(res));
    }
  } catch (error) {
    console.error(error);
  }
}, 500);

const input = document.querySelector('.input');

input.addEventListener('input', getData);
