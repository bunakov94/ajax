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
function clearSearchResult() {
  const searchResult = document.querySelector('.search-form__result');

  const searchResultItems = searchResult.querySelectorAll('li');
  for (const searchResultItem of searchResultItems) {
    searchResultItem.remove();
  }
}
function renderSearchResult({ items }) {
  for (const {
    name,
    stargazers_count: star,
    owner: { login },
  } of items) {
    const searchResult = document.querySelector('.search-form__result');

    const searchResultItem = document.createElement('li');
    searchResultItem.classList.add('search-form__item');
    searchResultItem.textContent = `${name}`;
    searchResultItem.onclick = () => addItemToFavorite({ name, star, login });
    searchResult.appendChild(searchResultItem);
  }
}
function addItemToFavorite({ name, star, login }) {
  const favoriteList = document.querySelector('.added-repo');

  const newFavoriteItem = document.createRange().createContextualFragment(
    `<li class="added-repo__item">
        <div><p>Name: ${name}</p>
          <p>Owner: ${login}</p>
          <p>Stars: ${star}</p>
      </div>
      <img src="close.png" class="delete" onClick="removeItemFromFavorite(this)">
    </li>`
  );
  favoriteList.append(newFavoriteItem);
  form.value = '';
  clearSearchResult();
}
const getData = debounce(async function () {
  clearSearchResult();
  try {
    if (form.value.length > 0) {
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

const form = document.querySelector('.search-form__input');

form.addEventListener('input', getData);
