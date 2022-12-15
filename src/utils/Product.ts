export default class Product{

    name : string | null;
    price : number;

    constructor(name:string | null, price:number){
        this.name = name;
        this.price = price;
    }

}