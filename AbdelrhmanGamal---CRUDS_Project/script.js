const title = document.getElementById('title');
const price = document.getElementById('price');
const taxes = document.getElementById('taxes');
const ads = document.getElementById('ads');
const discount = document.getElementById('discount');
const total = document.getElementById('total');
const count = document.getElementById('count');
const category = document.getElementById('category');
const submit = document.getElementById('submit');

let mood = 'create';
let temp;

let dataPro = [];
if (localStorage.product) {
  dataPro = JSON.parse(localStorage.product);
  showData();
}

// Funtction to get total
function getTotal() {
  if (price.value) {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.textContent = result;
    total.style.background = '#040';
  } else {
    total.innerHTML = '';
    total.style.background = '#a00d02';
  }
}

// Funtction to create product
submit.addEventListener('click', function () {
  if (!title.value) return;
  if (!price.value) return;
  const newPro = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.textContent,
    count: count.value,
    category: category.value.toLowerCase(),
  };
  if (mood === 'create') {
    // count
    if (newPro.count > 1) {
      for (let i = 0; i < newPro.count; i++) {
        dataPro.push(newPro);
      }
    } else {
      dataPro.push(newPro);
    }
  } else {
    dataPro[temp] = newPro;
    mood = 'create';
    count.style.display = 'block';
    submit.textContent = 'Create';
  }

  // save to local storage
  localStorage.setItem('product', JSON.stringify(dataPro));
  //   Clear Data from input
  clearInput();
  //   Render Data
  showData();
  console.log(newPro);
});

// clear inputs
const clearInput = function () {
  const inputs = [price, title, taxes, ads, discount, count, category];

  inputs.forEach(input => (input.value = ''));
  total.textContent = '';
};

function showData() {
  getTotal();
  let table = '';
  for (let i = 0; i < dataPro.length; i++) {
    table += `
      <tr>
              <td>${i}</td>
              <td>${dataPro[i].title}</td>
              <td>${dataPro[i].price}</td>
              <td>${dataPro[i].taxes}</td>
              <td>${dataPro[i].ads}</td>
              <td>${dataPro[i].discount}</td>
              <td>${dataPro[i].total}</td>
              <td>${dataPro[i].category}</td>
              <td><button onclick="updateData(${i})" id="update">update</button></td>
              <td><button onclick="deleteData(${i})" id="delete">delete</button></td>
            </tr>
    `;
    //console.log(table);
  }

  document.getElementById('tbody').innerHTML = table; // => بيشيل الي موجود ويبدله بالجديد عكس التاني بيعمل انسيرت للجديد علي القديم الي موجود

  const btnDelete = document.getElementById('deleteAll');
  if (dataPro.length > 0) {
    btnDelete.innerHTML = `
    <button onclick="deleteAll()" >delete All</button>
    `;
  } else {
    btnDelete.innerHTML = '';
  }
}

// delete
const deleteData = function (id) {
  console.log(id);
  dataPro.splice(id, 1);
  localStorage.product = JSON.stringify(dataPro);
  showData();
};

const deleteAll = function () {
  localStorage.clear();
  //dataPro.length = 0;
  dataPro.splice(0);
  showData();
};

// update
const updateData = function (id) {
  title.value = dataPro[id].title;
  price.value = dataPro[id].price;
  taxes.value = dataPro[id].taxes;
  ads.value = dataPro[id].ads;
  discount.value = dataPro[id].discount;
  category.value = dataPro[id].category;
  getTotal();
  count.style.display = 'none';
  submit.textContent = 'Update';
  mood = 'update';
  temp = id;
  scroll({
    top: 0,
    behavior: 'smooth',
  });
};

// search
let searchMood = 'title';
console.log(dataPro);
const search = document.getElementById('search');
function getSearchMood(id) {
  if (id === 'searchcategory') {
    searchMood = 'category';
    //search.placeholder = 'search by category';
  }
  if (id === 'searchtitle') {
    searchMood = 'title';
    // search.placeholder = 'search by title';
  }
  search.placeholder = 'search by ' + searchMood;

  search.focus();
  search.value = '';
  showData();
  console.log(searchMood);
}

function searchData(value) {
  const lowerCaseValue = value.toLowerCase();
  const filterKey = searchMood === 'title' ? 'title' : 'category';

  const table = dataPro
    .filter(item => {
      console.log(item[filterKey]);
      item[filterKey].toLowerCase().includes(lowerCaseValue);
    })
    .map(
      (item, index) => `
      <tr>
        <td>${index}</td>
        <td>${item.title}</td>
        <td>${item.price}</td>
        <td>${item.taxes}</td>
        <td>${item.ads}</td>
        <td>${item.discount}</td>
        <td>${item.total}</td>
        <td>${item.category}</td>
        <td><button onclick="updateData(${index})" id="update">update</button></td>
        <td><button onclick="deleteData(${index})" id="delete">delete</button></td>
      </tr>
    `
    )
    .join('');

  document.getElementById('tbody').innerHTML = table;
}

// Clean data

const products = [
  { name: 'Apple', category: 'Fruit', price: 1 },
  { name: 'Carrot', category: 'Vegetable', price: 0.5 },
  { name: 'Banana', category: 'Fruit', price: 0.75 },
  { name: 'Broccoli', category: 'Vegetable', price: 1.5 },
];

function filterProducts(searchValue, searchMode) {
  const lowerCaseValue = searchValue.toLowerCase();
  const filterKey = searchMode; // Can be 'name' or 'category'

  const filteredProducts = products
    .filter(product =>
      product[filterKey].toLowerCase().includes(lowerCaseValue)
    )
    .map(product => `${product.name} (${product.category}): $${product.price}`);

  return filteredProducts;
}

const filteredByName = filterProducts('a', 'name');
console.log(filteredByName);
// Output: ["Apple (Fruit): $1", "Banana (Fruit): $0.75", "Carrot (Vegetable): $0.5"]
