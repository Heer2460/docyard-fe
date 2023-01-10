import {BaseDTO} from "../../../base.dto";
import {UserProfileDTO} from "./user.profile.dto";

export class UserDTO extends BaseDTO {

    id: null | undefined;
    userName: string | undefined;
    groupId: null | undefined;
    groupName: null | undefined;
    departmentIds: null | undefined;
    password: string | undefined;
    logo: string | undefined;
    status: string | undefined;
    userProfile: UserProfileDTO = new UserProfileDTO();
    createdOn: Date = new Date();
    updatedOn: Date = new Date();

    convertToDTO(data: any) {
        this.id = data.id;
        this.userName = data.username;
        this.groupId = data.groupId;
        this.departmentIds = data.departmentIds;
        this.password = data.passwords.password;
        this.status = data.status;
        this.userProfile = this.userProfile.convertToNewDTO(data);
        this.createdOn = data.createdOn ? data.createdOn : new Date();
        this.updatedOn = new Date();
        this.createdBy = data.createdBy ? data.createdBy : 0;
        this.updatedBy = 0;
    }

    convertToNewDTO(data: any): UserDTO {
        let userDTO: UserDTO = new UserDTO();
        userDTO.id = null;
        userDTO.createdOn = new Date();
        userDTO.createdBy = 0;
        userDTO.convertToDTO(data);
        return userDTO;
    }
}
