const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');



const todos = [{
    text: 'First test todo'
    }, {
    text: 'Second test todo' 
}];

// Empty the list of ToDos - before each test!
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

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