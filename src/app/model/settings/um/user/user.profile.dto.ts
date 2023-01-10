import {BaseDTO} from "../../../base.dto";
export class UserProfileDTO extends BaseDTO {

    id: null | undefined;
    name: string | undefined;
    email: string | undefined;
    phoneNumber: string | undefined;
    mobileNumber: string | undefined;
    address: string | undefined;
    profilePhoto: string | undefined;
    createdOn: Date = new Date();
    updatedOn: Date = new Date();

    convertToDTO(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.phoneNumber = data.phoneNumber;
        this.mobileNumber = data.mobileNumber;
        this.address = data.address;
        this.profilePhoto = data.profilePhoto;
        this.createdOn = data.createdOn ? data.createdOn : new Date();
        this.updatedOn = new Date();
        this.createdBy = data.createdBy ? data.createdBy : 0;
        this.updatedBy = 0;
    }

    convertToNewDTO(data: any): UserProfileDTO {
        let userProfileDTO: UserProfileDTO = new UserProfileDTO();
        userProfileDTO.id = null;
        userProfileDTO.email = '';
        userProfileDTO.createdOn = new Date();
        userProfileDTO.createdBy = 0;
        userProfileDTO.convertToDTO(data);
        return userProfileDTO;
    }
}
