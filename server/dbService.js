const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    // console.log('db ' + connection.state);
});


class DbService {
    static getDbServiceInstance = () => instance ? instance : new DbService();

    async getFlowers(categoryId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM flowers WHERE category = ?;";

                connection.query(query, [categoryId], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getCategories() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM categories;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getUsers() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT user_name FROM users;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getFavoriteFlowers() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM flowers WHERE favorite = 1;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async getFlower(flowerId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM flowers WHERE id = ?;";

                connection.query(query, [flowerId], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewFlower(flower) {
        try {
            const { name, description, link, category, price } = flower;
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO flowers (name, description, link, category, price) VALUES (?,?,?,?,?);";

                connection.query(query, [name, description, link, category, price], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });

            return {
                id: insertId,
                name,
                description,
                link,
                category,
                price,
            };
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewUser(user) {
        try {
            const { user_name, password, first_name, last_name } = user;
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO users (user_name, password, first_name, last_name) VALUES (?,?,?,?);";

                connection.query(query, [user_name, password, first_name, last_name], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });

            return {
                id: insertId,
                user_name,
                password,
                first_name,
                last_name,
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteFlowerById(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM flowers WHERE id = ?";

                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateFlowerById(id, favorite) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE flowers SET favorite = ? WHERE id = ?";

                connection.query(query, [favorite, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByUserName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE user_name = ?;";

                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;
