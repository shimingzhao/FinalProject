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

let userInfo = {};

let categories;

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getCategories')
        .then(response => response.json())
        .then(data => loadCategoriesPage(data['data']));
});

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
                signupUserName.value = '';
                signupPwd.value = '';
                signupConfirmPwd.value = '';
                signupFirstName.value = '';
                signupLastName.value = '';

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
            }
        });
})

for (let cancelBtn of cancelBtns) {
    cancelBtn.addEventListener("click", function () {
        loginContainer.hidden = true;
        signupContainer.hidden = true;
        buttonsContainer.hidden = false;
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

    loginUserName.value = '';
    loginPwd.value = '';
});

// document.querySelector('table tbody').addEventListener('click', function (event) {
//     if (event.target.className === "delete-row-btn") {
//         deleteRowById(event.target.dataset.id);
//     }
//     if (event.target.className === "edit-row-btn") {
//         handleEditRow(event.target.dataset.id);
//     }
// });

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
                .then(data => loadFlowerModal(data['data']));
        }
    });

    document.querySelectorAll(".favorite-btn").forEach((btn) => {

        btn.onclick = () => {
            const selectedFlowerId = btn.dataset.id;

            btn.style.backgroundColor = 'salmon';
            btn.style.color = 'white';

            btn.innerHTML = 'Add to favorite';

            // fetch('http://localhost:5000/flower/' + selectedFlowerId)
            //     .then(response => response.json())
            //     .then(data => loadFlowerModal(data['data']));
        }
    });

    const span = document.querySelectorAll(".close")[0]
    if (span) span.onclick = () => modal.style.display = "none";

    // updateBtn.onclick = function () {
    //     const updateNameInput = document.querySelector('#update-name-input');


    //     console.log(updateNameInput);

    //     fetch('http://localhost:5000/update', {
    //         method: 'PATCH',
    //         headers: {
    //             'Content-type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             id: updateNameInput.dataset.id,
    //             name: updateNameInput.value
    //         })
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.success) {
    //                 location.reload();
    //             }
    //         })
    // }
});

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

// searchBtn.onclick = function () {
//     const searchValue = document.querySelector('#search-input').value;

//     fetch('http://localhost:5000/search/' + searchValue)
//         .then(response => response.json())
//         .then(data => loadCategoriesPage(data['data']));
// }

function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
}

function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-name-input').dataset.id = id;
}

// updateBtn.onclick = function () {
//     const updateNameInput = document.querySelector('#update-name-input');


//     console.log(updateNameInput);

//     fetch('http://localhost:5000/update', {
//         method: 'PATCH',
//         headers: {
//             'Content-type': 'application/json'
//         },
//         body: JSON.stringify({
//             id: updateNameInput.dataset.id,
//             name: updateNameInput.value
//         })
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 location.reload();
//             }
//         })
// }


const addBtn = document.querySelector('#add-flower-btn');

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
        .then(data => insertRowIntoTable(data['data']));
}



function insertRowIntoTable(data) {
    console.log(data);
    // const table = document.querySelector('table tbody');
    // const isTableData = table.querySelector('.no-data');

    // let tableHtml = "<tr>";

    // for (var key in data) {
    //     if (data.hasOwnProperty(key)) {
    //         if (key === 'dateAdded') {
    //             data[key] = new Date(data[key]).toLocaleString();
    //         }
    //         tableHtml += `<td>${data[key]}</td>`;
    //     }
    // }

    // tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    // tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

    // tableHtml += "</tr>";

    // if (isTableData) {
    //     table.innerHTML = tableHtml;
    // } else {
    //     const newRow = table.insertRow();
    //     newRow.innerHTML = tableHtml;
    // }
}

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

function loadFlowersPage(data) {
    let categoryHtml = "";

    data.forEach(function ({ id, name, link, price }) {
        categoryHtml += `<div class="items">`;
        categoryHtml += `<img src="${link}" alt="${name}" width="300px" height="300px">`;
        categoryHtml += `<span >${name}</span>`;
        categoryHtml += `<button type="button" class="btn btn-warning my-button flower-btn" data-id=${id}>${formatter.format(price)}</button>`;
        categoryHtml += `<button type="button" class="btn btn-warning my-button favorite-btn" data-id=${id}>Add to favorite</button>`;
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

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

