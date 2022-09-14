import {BaseDTO} from "../../../base.dto";

export class UserDTO extends BaseDTO {

    id: null | undefined;
    username: string | undefined;
    name: string | undefined;
    email: string | undefined;
    phoneNumber: string | undefined;
    mobileNumber: string | undefined;
    groupId: null | undefined;
    departmentId: null | undefined;
    address: string | undefined;
    password: string | undefined;
    profilePicture: string | undefined;
    status: string | undefined;
    createdOn: Date = new Date();
    updatedOn: Date = new Date();

    convertToDTO(data: any) {
        this.id = data.id;
        this.username = data.username;
        this.name = data.name;
        this.email = data.email;
        this.phoneNumber = data.phoneNumber;
        this.mobileNumber = data.mobileNumber;
        this.groupId = data.groupId;
        this.departmentId = data.departmentId;
        this.address = data.address;
        this.password = data.passwords.password;
        this.profilePicture = data.profilePicture;
        this.status = data.status;

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
