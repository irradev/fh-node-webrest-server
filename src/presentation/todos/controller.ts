import { Request, Response } from "express";

const todos = [
    { id: 1, text: 'Buy milk', completedAt: new Date() },
    { id: 2, text: 'Buy bread', completedAt: null },
    { id: 3, text: 'Buy butter', completedAt: new Date() },
]

export class TodosController {
    
    // * Dependency Injection
    constructor() {}


    public getTodos = (req: Request, res: Response) => {
        return res.json(todos);
    }

    public getTodoById = (req: Request, res: Response) => {
        const { id } = req.params;
        if (isNaN(+id)) return res.status(400).json({ error: 'Invalid id' });

        const todo = todos.find(t => t.id === Number(id));
        if (!todo) return res.status(404).json({ error: 'Todo not found' });

        return res.json(todo);
    }

    public createTodo = (req: Request, res: Response) => {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'Text property is required' });

        const todo = { id: todos.length + 1, text, completedAt: new Date() };
        todos.push(todo);

        return res.json(todo);
    }

    public updateTodo = (req: Request, res: Response) => {
        const { id } = req.params;
        if (isNaN(+id)) return res.status(400).json({ error: 'Invalid id' });

        const todo = todos.find(t => t.id === Number(id));
        if (!todo) return res.status(404).json({ error: 'Todo not found' });

        const { text, completedAt } = req.body;
        if (!text && !completedAt) return res.status(400).json({ error: 'At least one of Text or completedAt property is required' });

        // ! Esto es válido porque los objetos pasan por referencia:
        todo.text = text || todo.text;

        (completedAt === 'null')
        ? todo.completedAt = null
        : todo.completedAt = new Date(completedAt || todo.completedAt);

        // * Lo ideal sería hacerlo de esta manera:
        // * todos[todos.indexOf(todo)].text = text || todos[todos.indexOf(todo)].text;

        return res.json(todo);
    }

    public deleteTodo = (req: Request, res: Response) => {
        const { id } = req.params;
        if (isNaN(+id)) return res.status(400).json({ error: 'Invalid id' });

        const todo = todos.find(t => t.id === Number(id));
        if (!todo) return res.status(404).json({ error: 'Todo not found' });

        todos.splice(todos.indexOf(todo), 1);
        return res.json(todo);
    }

}