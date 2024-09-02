

export class UpdateTodoDto {

    private constructor(
        public readonly id: number,
        public readonly text?: string,
        public readonly completedAt?: Date
    ) {}

    get values() {
        const returnObj: Record<string, any> = {}

        if (this.text) returnObj.text = this.text;
        if (this.completedAt) returnObj.completedAt = this.completedAt;

        return returnObj;
    }

    static update(props: Record<string, any>): [string?, UpdateTodoDto?] {

        const {id, text, completedAt } = props;

        if (!id || isNaN(+id)) return ['Id parameter must be a valid number'];
        if (!text && !completedAt ) return ['At least one property is required'];

        let newCompletedAt = completedAt;
        if (completedAt) {
            newCompletedAt = new Date(completedAt);
            if (newCompletedAt.toString() === 'Invalid Date') {
                return ['CompletedAt must be a valid date'];
            }
        }

        return [undefined, new UpdateTodoDto(id, text, newCompletedAt)];
    }

}