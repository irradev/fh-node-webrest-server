import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto } from "../../domain/dtos/todos/create-todo.dto";
import { UpdateTodoDto } from "../../domain/dtos/todos/update-todo.dto";
import { TodoRepository } from "../../domain/repositories/todo.repository";



export class TodosController {
    
    // * Dependency Injection
    constructor(
        private readonly todoRepository: TodoRepository
    ) {}

    public getTodos = async(req: Request, res: Response) => {
        const todos = await this.todoRepository.getAll();
        return res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {
        const id = +req.params.id;

        try {
            const todo = await this.todoRepository.findById(id);
    
            return res.json(todo);
        } catch (error) {
            console.log(error);
            return res.status(400).json({error:'Error getting this todo'});
        }
    }

    public createTodo = async (req: Request, res: Response) => {
        const [error, dataDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error });
        
        try {
            const todo = await this.todoRepository.create(dataDto!);

            return res.json(todo);
        } catch (error) {
            console.log(error);
            return res.status(400).json({error:'Error creating this todo'});
        }

    }

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        
        const [error, dataDto] = UpdateTodoDto.update({...req.body, id});
        if (error) return res.status(400).json({ error });

       
        try {
            const todo = await this.todoRepository.update(dataDto!);
            return res.json(todo);
        } catch (error) {
            console.log(error);
            return res.status(400).json({error:'Error updating this todo'});
        }

    }

    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        
        try {
            const todo = await prisma.todo.delete({ where: { id } });
            
            return res.json(todo);
        } catch (error) {
            console.log(error);
            return res.status(400).json({error:'Error deleting this todo'});
        }
    }

}