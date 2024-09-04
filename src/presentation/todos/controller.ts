import { Request, Response } from "express";
import { CreateTodoDto } from "../../domain/dtos/todos/create-todo.dto";
import { UpdateTodoDto } from "../../domain/dtos/todos/update-todo.dto";
import { TodoRepository } from "../../domain/repositories/todo.repository";
import { GetAllTodos } from "../../domain/use-cases/todos/get-all-todos";
import { GetTodo } from "../../domain/use-cases/todos/get-todo";
import { CreateTodo } from "../../domain/use-cases/todos/create-todo";
import { UpdateTodo } from "../../domain/use-cases/todos/update-todo";
import { DeleteTodo } from "../../domain/use-cases/todos/delete-todo";
import { CustomError } from "../../domain/errors/custom.error";



export class TodosController {
    
    // * Dependency Injection
    constructor(
        private readonly todoRepository: TodoRepository
    ) {}

    private errorHandler = (res: Response, error: unknown) => {

        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({error: error.message});
        }

        // guardar log de error
        return res.status(500).json({error: 'Internal Server Error'});
    }

    public getTodos = (req: Request, res: Response) => {
        new GetAllTodos(this.todoRepository)
        .execute()
        .then(todos => res.json(todos))
        .catch(error => this.errorHandler(res, error));
    }

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;

        new GetTodo(this.todoRepository)
        .execute(id)
        .then(todo => res.json(todo))
        .catch((error) => this.errorHandler(res, error));
    }

    public createTodo = (req: Request, res: Response) => {
        const [error, dataDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error });
        
        new CreateTodo(this.todoRepository)
        .execute(dataDto!)
        .then(todo => res.status(201).json(todo))
        .catch(error => this.errorHandler(res, error));

    }

    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        
        const [error, dataDto] = UpdateTodoDto.update({...req.body, id});
        if (error) return res.status(400).json({ error });

        new UpdateTodo(this.todoRepository)
        .execute(dataDto!)
        .then(todo => res.json(todo))
        .catch(error => this.errorHandler(res, error));

    }

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteTodo(this.todoRepository)
        .execute(id)
        .then(todo => res.json(todo))
        .catch(error => this.errorHandler(res, error));
    }

}