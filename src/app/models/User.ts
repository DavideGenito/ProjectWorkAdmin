export class User {
    id: number = 0
    firstName: string = ""
    lastName: string = ""
    email: string = ""
    credit: number = 0
    role: string = ""
    password: string = ""

    constructor(firstName: string, lastName: string, email: string, credit: number, role: string, password: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.credit = credit;
        this.role = role;
        this.password = password;
    }


}