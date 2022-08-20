const appEl = document.querySelector('#app');
const select = document.querySelector('#category-select');
const backBtn = document.getElementById("back-to-home-page-btn");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const loginContainer = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");
const cancelBtns = document.getElementsByClassName("cancel-btn");
const buttonsContainer = document.getElementById("buttons-container");
const loginInputBtn = document.getElementById("login-input-btn");
const signupInputBtn = document.getElementById("signup-input-btn");
const modal = document.getElementById("myModal");

const loginUserName = document.querySelector('#login-username-input');
const loginPwd = document.querySelector('#login-password-input');

const signupUserName = document.querySelector('#signup-username-input');
const signupPwd = document.querySelector('#signup-password-input');
const signupConfirmPwd = document.querySelector('#signup-confirm-password-input');
const signupFirstName = document.querySelector('#signup-firstname-input');
const signupLastName = document.querySelector('#signup-lastname-input');

const userInfoContainer = document.querySelector('#user-info-container');
const userInfoBlock = document.querySelector('#user-info');

const signOutBtn = document.querySelector('#signout-btn');

const infoContainer = document.querySelector('#info-container');
const addBtn = document.querySelector('#add-flower-btn');

let userInfo = {};
let categories;
let favoriteFlowers = []

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getCategories')
        .then(response => response.json())
        .then(data => loadCategoriesPage(data['data']));
});

function loadCategoriesPage(data) {
    categories = data;

    let categoryHtml = "";
    let optionsHtml = "";

    data.forEach(function ({ id, name, link }) {
        categoryHtml += `<div class="items">`;
        categoryHtml += `<img src="${link}" alt="${name}" width="300px" height="300px">`;
        categoryHtml += `<button type="button" class="btn btn-success my-button category-btn" data-id=${id}>${name}</button>`;
        categoryHtml += "</div>";

        optionsHtml += `<option value="${id}">${name}</option>`;
    });

    appEl.innerHTML = categoryHtml;
    select.innerHTML = optionsHtml;
    backBtn.hidden = true;
}


backBtn.addEventListener("click", function () {
    location.reload();
});

loginBtn.addEventListener("click", function () {
    loginContainer.hidden = false;
    signupContainer.hidden = true;
    buttonsContainer.hidden = true;
})

signupBtn.addEventListener("click", function () {
    loginContainer.hidden = true;
    signupContainer.hidden = false;
    buttonsContainer.hidden = true;
})

signupInputBtn.addEventListener("click", () => {
    const user_name = signupUserName.value;
    const password = signupPwd.value;
    const confirm_password = signupConfirmPwd.value;
    const first_name = signupFirstName.value;
    const last_name = signupLastName.value;

    let flag = true

    fetch('http://localhost:5000/users')
        .then(response => response.json())
        .then(data => {
            const users = data['data'];

            if (users.find(user => user.user_name === user_name)) {
                resetSignupInput();

                flag = false;

                return infoContainer.innerHTML = '<p>Exist user name, please choose a new one</p>';
            };

            if (password !== confirm_password) {
                signupPwd.value = '';
                signupConfirmPwd.value = '';

                flag = false;

                return infoContainer.innerHTML = '<p>Password and confirm password not match</p>';
            }

            if (flag) {
                fetch('http://localhost:5000/insert_user', {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({ user_name, password, first_name, last_name })
                })
                    .then(response => response.json())
                    .then(data => {
                        userInfo = data['data'];

                        userInfoContainer.hidden = false;
                        userInfoBlock.innerHTML = `<p>Welcome, ${userInfo.first_name} ${userInfo.last_name}</p>`;
                        loginContainer.hidden = true;
                        signupContainer.hidden = true;
                        signOutBtn.innerHTML = 'Sign out'
                    });

                resetSignupInput();
            }
        });
})

for (let cancelBtn of cancelBtns) {
    cancelBtn.addEventListener("click", function () {
        loginContainer.hidden = true;
        signupContainer.hidden = true;
        buttonsContainer.hidden = false;

        resetLoginInput();
        resetSignupInput();
    })
}

loginInputBtn.addEventListener("click", function () {
    const username = loginUserName.value;
    const password = loginPwd.value;

    fetch('http://localhost:5000/user/' + username)
        .then(response => response.json())
        .then(data => {
            userInfo = data['data'][0];
            const { password: passwordFromDb, first_name, last_name } = userInfo;

            if (password === passwordFromDb) {
                userInfoContainer.hidden = false;
                userInfoBlock.innerHTML = `<p>Welcome, ${first_name} ${last_name}</p>`;
                loginContainer.hidden = true;
                signupContainer.hidden = true;
                signOutBtn.innerHTML = 'Sign out'
            } else {
                userInfoContainer.hidden = false;
                userInfoBlock.innerHTML = `<p>User name or password incorrect, please try again</p>`;
                loginContainer.hidden = true;
                signupContainer.hidden = true;
                signOutBtn.innerHTML = 'Back'
            }
        });
})

signOutBtn.addEventListener("click", () => {
    userInfo = {};
    userInfoContainer.hidden = true;
    buttonsContainer.hidden = false;

    resetLoginInput();
});

document.addEventListener("DOMNodeInserted", () => {
    document.querySelectorAll(".category-btn").forEach((btn) => {
        btn.onclick = () => {
            const selectedCategoryId = btn.dataset.id;

            fetch('http://localhost:5000/category/' + selectedCategoryId)
                .then(response => response.json())
                .then(data => loadFlowersPage(data['data']));
        }
    });

    document.querySelectorAll(".flower-btn").forEach((btn) => {
        btn.onclick = () => {
            const selectedFlowerId = btn.dataset.id;

            fetch('http://localhost:5000/flower/' + selectedFlowerId)
                .then(response => response.json())
                .then(data => {
                    loadFlowerModal(data['data']);
                });
        }
    });

    document.querySelectorAll(".favorite-btn").forEach((btn) => {
        btn.onclick = () => {
            const selectedFlowerId = btn.dataset.id;

            if (btn.innerHTML === 'Added') {
                fetch('http://localhost:5000/update', {
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: selectedFlowerId,
                        favorite: 0
                    })
                })

                fetch('http://localhost:5000/favorite')
                    .then(response => response.json())
                    .then(data => {
                        favoriteFlowers = data['data'];
                        console.log(favoriteFlowers);
                        // insertFavoriteNumber(data['data']);
                    })

                return;
            }

            if (btn.innerHTML === 'Add to favorite') {
                fetch('http://localhost:5000/update', {
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: selectedFlowerId,
                        favorite: 1
                    })
                })

                fetch('http://localhost:5000/favorite')
                    .then(response => response.json())
                    .then(data => {
                        favoriteFlowers = data['data'];
                        console.log(favoriteFlowers);
                        // insertFavoriteNumber(data['data']);
                    })

                return;
            }
        }
    });

    const span = document.querySelectorAll(".close")[0]
    if (span) span.onclick = () => modal.style.display = "none";
});

addBtn.onclick = function () {
    const nameInput = document.querySelector('#name-input');
    const descriptionInput = document.querySelector('#description-input');
    const linkInput = document.querySelector('#link-input');
    const priceInput = document.querySelector('#price-input');
    const categorySelect = document.querySelector('#category-select');

    const name = nameInput.value;
    const description = descriptionInput.value;
    const price = priceInput.value;
    const link = linkInput.value;
    const category = categorySelect.value;

    nameInput.value = "";
    descriptionInput.value = "";
    linkInput.value = "";
    priceInput.value = "";
    categorySelect.value = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name, description, price, link, category })
    })
        .then(response => response.json())
        .then(data => console.log(data));
}

function loadFlowersPage(data) {
    let categoryHtml = "";

    data.forEach(function ({ id, name, link, price, favorite }) {
        console.log(favorite);
        categoryHtml += `<div class="items">`;
        categoryHtml += `<img src="${link}" alt="${name}" width="300px" height="300px">`;
        categoryHtml += `<span >${name}</span>`;
        categoryHtml += `<button type="button" class="btn btn-warning my-button flower-btn" data-id=${id}>${formatter.format(price)}</button>`;
        categoryHtml += `<button type="button" class="btn btn-warning my-button favorite-btn" data-id=${id}>${favorite ? 'Added' : 'Add to favorite'}</button>`;
        categoryHtml += "</div>";
    });

    appEl.innerHTML = `<div class="flowers-container">${categoryHtml}</div>`;
    backBtn.hidden = false;
}

function loadFlowerModal(data) {
    const { name, link, price, description } = data[0];
    const modalHtml = `<div class="modal-content">
    <span class="close">&times;</span>
    <div class="items">
    <img src="${link}" alt="${name}" width="300px" height="300px">
    <span >${name}</span>
    </div>
    </div>`;
    modal.innerHTML = modalHtml;
    modal.style.display = "block";
}

function resetSignupInput() {
    signupUserName.value = '';
    signupPwd.value = '';
    signupConfirmPwd.value = '';
    signupFirstName.value = '';
    signupLastName.value = '';
}

function resetLoginInput() {
    loginUserName.value = '';
    loginPwd.value = '';
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

