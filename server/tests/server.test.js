const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'testing the todo text, yo';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1); // Expect to have created just 1 todo that matches the text
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
     }); 

     it('should not create Todo with invalid body data', (done) => {
            request(app)
                .post('/todos')
                .send({}) // sending empty object should return error
                .expect(400)

                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.find().then((todos) => {
                        expect(todos.length).toBe(2); // the two test todos that we created above
                        done();
                    }).catch((err) => done(err));
                });

        });

});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
        .end(done); // no need to use a function here as above because no async happening here
    });
});

describe('GET/todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        // make sure we get a 404 back
        var newID = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${newID}`)
            .expect(404)
            .end(done);
         });

    it('should return a 404 if invalid ID', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });

});

describe('DELETE/todos/:id', () => {

    it('should remove a todo', (done) => {
        var id = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((err) => done(err));
            });
    });
    // it('should return a 404 if not found', (done) => {

    // });
    // it('should return a 404 if ID invalid', (done) => {

    // });


});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        // grab id of first item
        var id = todos[0]._id.toHexString();
        var newText = "Here is my changed text";
        request(app)
            .patch(`/todos/${id}`)
            .send({ 
                text: newText,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end((err,res) => {
                if(err) {
                    return done(err);
                } done();
            });
        });
        it('should clear completedAt when todo is not completed', (done) => {
            var id = todos[1]._id.toHexString();
            var newText = "Here is my changed text, yo";
            request(app)
                .patch(`/todos/${id}`)
                .send({ 
                    text: newText,
                    completed: false
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(newText);
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.completedAt).toNotExist();
                })
                .end((err,res) => {
                    if(err) {
                        return done(err);
                    } done();
                });
        });

});

describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return a 401 if not authenticated',(done) => {
        request(app)
            .get('/users/me')
            // we aren't providing tokens, so authentication should fail
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = "example@example.com";
        var password = "123mnb!";

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    // password should be hashed by now
                    expect(user.password).toNotBe({password});
                    done();
                });
            });
    });

    it('should return validation errors if request is invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'and',
                password: '123'
            })
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({
                // provide the same email in the seed data - should fail
                email: users[0].email,
                password: users[0].password
            })
            .expect(400)
            .end(done);
    });
});

// npm test