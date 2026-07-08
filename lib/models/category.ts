export class Category {
  constructor(
    private _id: string,
    private _name: string,
    private _coverage_type: string,
  ) {}

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get coverage_type(): string {
    return this._coverage_type;
  }
}
