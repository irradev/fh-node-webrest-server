import { prisma } from '../../data/postgres';
import { TodoDatasource } from '../../domain/datasources/todo.datasource';
import { CreateTodoDto } from '../../domain/dtos/todos/create-todo.dto';
import { UpdateTodoDto } from '../../domain/dtos/todos/update-todo.dto';
import { TodoEntity } from '../../domain/entities/todo.entity';
import { CustomError } from '../../domain/errors/custom.error';


export class TodoDatasourceImpl implements TodoDatasource {
    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const todo = await prisma.todo.create({
            data: createTodoDto
        });

        return TodoEntity.fromObj(todo);
    }
    async getAll(): Promise<TodoEntity[]> {
        const todos = await prisma.todo.findMany();

        return todos.map((todo) => TodoEntity.fromObj(todo));
    }
    async findById(id: number): Promise<TodoEntity> {
        const todo = await prisma.todo.findUnique({ where: { id: Number(id) } });
        if (!todo) throw new CustomError(`Todo with id ${id} not found`, 404);

        return TodoEntity.fromObj(todo);
    }
    async update(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        await this.findById(updateTodoDto.id);
        
        const todo = await prisma.todo.update({
            where: { id: updateTodoDto.id },
            data: updateTodoDto!.values
        });

        return TodoEntity.fromObj(todo);

    }
    async delete(id: number): Promise<TodoEntity> {
        await this.findById(id);
        const todo = await prisma.todo.delete({ where: { id: Number(id) } });
        
        return TodoEntity.fromObj(todo);
    }
}