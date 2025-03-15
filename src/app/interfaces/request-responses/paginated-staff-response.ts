import { Staff } from "../staff";

export interface PaginatedStaffResponse {
    staff:Staff[];
    cursor:object;
}
