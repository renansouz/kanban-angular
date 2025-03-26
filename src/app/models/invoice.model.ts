export interface invoice {
    id: string;
    caffeine: boolean;
    date: Date;
    discount: number;
    hot: boolean;
    milkCount: number;
    subTotal: number;
    syrupCount: number;
    tax: number;
    total: number;
}