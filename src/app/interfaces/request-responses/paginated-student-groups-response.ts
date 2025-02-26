import { StudentGroup } from "../student-group";

export interface PaginatedStudentGroupsResponse {
    studentGroups: StudentGroup[];
    cursor: object;
}
