import { CreateTodoDto } from "../dtos/todos/create-todo.dto";
import { UpdateTodoDto } from "../dtos/todos/update-todo.dto";
import { TodoEntity } from "../entities/todo.entity";


export abstract class TodoDatasource {

    abstract create(createTodoDto: CreateTodoDto): Promise<TodoEntity>;
    //TODO: paginación, ...
    abstract getAll(): Promise<TodoEntity[]>;
    abstract findById(id: number): Promise<TodoEntity>;
    abstract update(updateTodoDto: UpdateTodoDto): Promise<TodoEntity>;
    abstract delete(id: number): Promise<TodoEntity>;
}