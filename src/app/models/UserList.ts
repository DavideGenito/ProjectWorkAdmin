import { Injectable } from "@angular/core";
import { User } from "./User";

@Injectable({
  providedIn: 'root',
})
export class UserList {
    public allUser: User[] = [];


    UpdateUsers(users:User[]) {
        this.allUser = users;
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

    searchUser(id:number): User | undefined {
        return this.allUser.find(u => u.id === id);
    }

    viewAllUsers() {
        return this.allUser;
    }
}