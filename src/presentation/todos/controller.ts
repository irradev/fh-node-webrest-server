import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto } from "../../domain/dtos/todos/create-todo.dto";
import { UpdateTodoDto } from "../../domain/dtos/todos/update-todo.dto";



export class TodosController {
    
    // * Dependency Injection
    constructor() {}

    private findTodoById = async (id: number | string, res: Response) => {
        if (isNaN(+id)) {
            res.status(400).json({ error: 'Invalid id' });
            return null;
        }
        const todo = await prisma.todo.findUnique({ where: { id: Number(id) } });
        if (!todo) {
            res.status(404).json({ error: 'Todo not found' });
            return null;
        }

        return todo;
    }

    public getTodos = async(req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();

        return res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {
        const { id } = req.params;

        const todo = await this.findTodoById(id, res);
        if (!todo) return;

        return res.json(todo);
    }

    public createTodo = async (req: Request, res: Response) => {
        const [error, dataDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error });
        
        const todo = await prisma.todo.create({
            data: dataDto!
        });

        return res.json(todo);
    }

    public updateTodo = async (req: Request, res: Response) => {
        const { id } = req.params;
        
        const [error, dataDto] = UpdateTodoDto.update({...req.body, id});
        if (error) return res.status(400).json({ error });

        const todo = await this.findTodoById(id, res);
        if (!todo) return;
       
        try {
            const todo = await prisma.todo.update({
                where: { id: Number(id) },
                data: dataDto!.values
            });

            return res.json(todo);
        } catch (error) {
            console.log(error);
            return res.status(500).json({error:'Error updating this todo'});
        }

    }

    public deleteTodo = async (req: Request, res: Response) => {
        const { id } = req.params;
        const todo = await this.findTodoById(id, res);
        if (!todo) return;

        try {
            const todo = await prisma.todo.delete({ where: { id: Number(id) } });
            
            return res.json(todo);
        } catch (error) {
            console.log(error);
            return res.status(500).json({error:'Error deleting this todo'});
        }
    }

}