export class User{
    id:number=0
    firstName:string=""
    lastName:string=""
    email:string=""
    credit:number=0
    Admin:boolean=false
    password:string=""

    constructor(firstName:string, lastName:string, email:string, credit:number, Admin:boolean, password:string)
    {
        this.firstName=firstName
        this.lastName=lastName
        this.email=email
        this.credit=credit
        this.Admin=Admin
        this.password=password
    }
}