export class Column {
  constructor(
    public name: string,
    public tasks: { name: string; description: string }[]
  ) {}
}
