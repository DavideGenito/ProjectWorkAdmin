import { User } from "./User";

export class UserList {
    allUser:User[]=[]

    constructor(allUser:User[])
    {
        this.allUser=allUser
    }

    AddUser(user:User)
    {
        this.allUser.push(user)
    }

    UpdateUser(user:User) {
        let index = this.allUser.findIndex(u => u.id === user.id);
        if(index != -1){
            this.allUser[index] = user
        }
    }

    deleteUser(id:number)
    {
        let index = this.allUser.findIndex(u => u.id === id);
        if(index != -1){
            this.allUser.splice(index,1)
        }
    }
}