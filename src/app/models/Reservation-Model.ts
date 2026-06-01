import { User } from "./User";

export class ReservationModel {
    user: User = new User('', '', '', 0, true, '')
    date: Date = new Date()
    time: String = ''
    slotId: Number = 0
    price: Number = 0
}