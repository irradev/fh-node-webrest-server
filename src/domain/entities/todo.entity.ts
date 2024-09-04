

export class TodoEntity {

    constructor(
        public id: number,
        public text: string,
        public completedAt?: Date | null
    ) {}

    get isCompleted() {
        return !!this.completedAt;
    }


    public static fromObj(object: Record<string, any>) {

        const {id, text, completedAt } = object;

        if (!id || isNaN(+id)) throw new Error('Id parameter must be a valid number');
        if (!text) throw new Error('Text parameter is required');
        if (completedAt && isNaN(new Date(completedAt).getTime())) throw new Error('CompletedAt must be a valid date');

        return new TodoEntity(+id, text, completedAt);
    }
    
}