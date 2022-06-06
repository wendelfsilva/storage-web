export class PaginatedResult<T> {
    count!: number;
    next!: string;
    previous!: string;
    results!: T[];
}
