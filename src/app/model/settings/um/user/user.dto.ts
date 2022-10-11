import {BaseDTO} from "../../../base.dto";

export class UserDTO extends BaseDTO {

    id: null | undefined;
    username: string | undefined;
    name: string | undefined;
    email: string | undefined;
    phoneNumber: string | undefined;
    mobileNumber: string | undefined;
    groupId: null | undefined;
    groupName: null | undefined;
    departmentIds: null | undefined;
    address: string | undefined;
    password: string | undefined;
    profilePhoto: string | undefined;
    logo: string | undefined;
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
        this.departmentIds = data.departmentIds;
        this.address = data.address;
        this.password = data.passwords.password;
        this.profilePhoto = data.profilePhoto;
        this.status = data.status;

        this.createdOn = data.createdOn ? data.createdOn : new Date();
        this.updatedOn = new Date();
        this.createdBy = data.createdBy ? data.createdBy : 0;
        this.updatedBy = 0;
    }

    convertToNewDTO(data: any): UserDTO {
        let userDTO: UserDTO = new UserDTO();
        userDTO.id = null;
        userDTO.email = '';
        userDTO.createdOn = new Date();
        userDTO.createdBy = 0;
        userDTO.convertToDTO(data);
        return userDTO;
    }

}
