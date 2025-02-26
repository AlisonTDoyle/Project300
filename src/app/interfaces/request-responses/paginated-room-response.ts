import { Room } from "./../room";

export interface PaginatedRoomResponse {
    rooms:Room[];
    cursor: Object;
}
