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

const form = document.querySelector('.search-form__input');
const added = document.querySelector('.added-repo');
const ul = document.querySelector('.search-form__result');
const getData = debounce(async function () {
  const lis = ul.querySelectorAll('li');
  for (const li of lis) {
    li.remove();
  }
  try {
    if (form.value.length > 0) {
      await fetch(
        `https://api.github.com/search/repositories?q=${this.value}&per_page=5`
      )
        .then((res) => res.json())
        .then((res) => {
          for (const {
            name,
            stargazers_count,
            owner: { login },
          } of res.items) {
            const li = document.createElement('li');
            li.classList.add('search-form__item');
            li.textContent = `${name}`;
            li.dataset.name = `${name}`;
            li.dataset.owner = `${login}`;
            li.dataset.stars = `${stargazers_count}`;
            li.addEventListener('click', function () {
              const add = document.createElement('li');
              add.classList.add('added-repo__item');
              add.innerHTML = `<div><p>Name: ${this.dataset.name}</p>
                                <p>Owner: ${this.dataset.owner}</p>
                                <p>Stars: ${this.dataset.stars}</p></div>`;

              const img = document.createElement('img');
              img.classList.add('delete');
              img.src = 'close.png';
              img.addEventListener('click', function () {
                this.parentElement.remove();
              });
              add.appendChild(img);
              added.appendChild(add);
              form.value = '';
              const lis = ul.querySelectorAll('li');
              for (const li of lis) {
                li.remove();
              }
            });
            ul.appendChild(li);
          }
        });
    }
  } catch (error) {
    console.error(error);
  }
}, 500);

form.addEventListener('input', getData);
