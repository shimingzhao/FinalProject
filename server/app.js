const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// create flower
app.post('/insert', (request, response) => {
    const newFlower = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewFlower(newFlower);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// create user
app.post('/insert_user', (request, response) => {
    const newUser = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewUser(newUser);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// read flowers
app.get('/category/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.getFlowers(id);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// read flower
app.get('/flower/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.getFlower(id);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// read categories
app.get('/getCategories', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getCategories();

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// read users
app.get('/users', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getUsers();

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// update
app.patch('/update', (request, response) => {
    const { id, name } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateFlowerById(id, name);

    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

// delete
app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteFlowerById(id);

    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

app.get('/user/:username', (request, response) => {
    const { username } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByUserName(username);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

app.listen(process.env.PORT || 3000, () => console.log('app is running'));
