import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';


describe('Todo route testing', () => {

    beforeAll(async () => {
        // jest.spyOn(console, 'log').mockImplementation();
        await testServer.start();
    });

    beforeEach(async () => {
        await prisma.todo.deleteMany();
    });

    afterAll(async () => {
        await prisma.todo.deleteMany();
        await testServer.close();
        jest.clearAllMocks();
    });

    const todo1 = { text: 'Hola mundo 1' };
    const todo2 = { text: 'Hola mundo 2' };

    test('should return TODOs api/todos', async() => {

        await prisma.todo.createMany({ data: [todo1, todo2] });

        const { body } = await request(testServer.app)
            .get('/api/todos')
            .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(2);
        expect(body[0].text).toBe(todo1.text);
        expect(body[1].text).toBe(todo2.text);
        expect(body[0].completedAt).toBeNull();
        expect(body[1].completedAt).toBeNull();

    });

    test('should return a TODO api/todos/:id', async() => {

        const createdTodo = await prisma.todo.create({ data: todo1 });

        const { body } = await request(testServer.app)
            .get('/api/todos/' + createdTodo.id)
            .expect(200);

        expect(body).toBeInstanceOf(Object);
        expect(body).toEqual({
            id: createdTodo.id,
            text: todo1.text,
            completedAt: createdTodo.completedAt
        });

    });

    test('should return 404 api/todos/:id', async() => {

        const id = 123;
        const { body } = await request(testServer.app)
            .get('/api/todos/' + id)
            .expect(404);

        expect(body).toEqual( { error: `Todo with id ${id} not found` });

    });

    test('should create a TODO api/todos', async() => {

        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send(todo1)
            .expect(201);

        expect(body).toBeInstanceOf(Object);
        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: null
        });

    });
    
    test('should return an error when creating a TODO if text is not present: POST api/todos', async() => {

        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send({})
            .expect(400);

        expect(body).toEqual({ error: expect.any(String) });

    });
    
    test('should return an error when creating a TODO if text is empty: POST api/todos', async() => {

        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send({text: ' '})
            .expect(400);

        expect(body).toEqual({ error: expect.any(String) });

    });

    test('should update a TODO api/todos/:id', async() => {

        const createdTodo = await prisma.todo.create({ data: todo1 });
        const updateData = { text: 'test updated', completedAt: new Date() };

        const { body } = await request(testServer.app)
            .put('/api/todos/' + createdTodo.id)
            .send(updateData)
            .expect(200);

        expect(body).toBeInstanceOf(Object);
        expect(body).toEqual({
            id: createdTodo.id,
            text: updateData.text,
            completedAt: new Date(updateData.completedAt).toISOString(),
        });

    });

    test('should return 404 if TODO not found to update: PUT api/todos/:id', async() => {

        const id = 123;

        const { body } = await request(testServer.app)
            .put('/api/todos/' + id)
            .send({text: 'test uupdated'})
            .expect(404);
        
        expect(body).toEqual( { error: `Todo with id ${id} not found` });
    });

    test('should return an updated TODO only the date', async() => {

        const createdTodo = await prisma.todo.create({ data: todo1 });
        const updateData = { completedAt: new Date() };
        
        const { body } = await request(testServer.app)
            .put('/api/todos/' + createdTodo.id)
            .send(updateData)
            .expect(200);
        
        expect(body).toBeInstanceOf(Object);
        expect(body).toEqual({
            id: createdTodo.id,
            text: createdTodo.text,
            completedAt: new Date(updateData.completedAt).toISOString(),
        });
    });

    test('should return an error when updating a TODO if text or completedAt is not present: PUT api/todos/:id', async() => {

        const createdTodo = await prisma.todo.create({ data: todo1 });

        const { body } = await request(testServer.app)
            .put('/api/todos/' + createdTodo.id)
            .send({})
            .expect(400);
        
        expect(body).toEqual({ error: expect.any(String) });

    });

    test('should delete a TODO api/todos/:id', async() => {

        const createdTodo = await prisma.todo.create({ data: todo1 });

        const { body } = await request(testServer.app)
            .delete('/api/todos/' + createdTodo.id)
            .expect(200);
        
        expect(body).toBeInstanceOf(Object);
        expect(body).toEqual({
            id: createdTodo.id,
            text: createdTodo.text,
            completedAt: createdTodo.completedAt
        });

    });

    test('should return 404 if TODO not found to delete: DELETE api/todos/:id', async() => {

        const id = 123;

        const { body } = await request(testServer.app)
            .delete('/api/todos/' + id)
            .expect(404);
        
        expect(body).toEqual( { error: expect.any(String) });
    
    });
});