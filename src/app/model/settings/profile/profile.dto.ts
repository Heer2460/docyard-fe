import {BaseDTO} from "../../base.dto";

export class ProfileDTO extends BaseDTO {

    userId: null | undefined;
    email: string | undefined;
    name: string | undefined;
    phoneNumber: null | undefined;
    mobileNumber: null | undefined;
    address: string | undefined;
    currentPassword: string | undefined;
    newPassword: string | undefined;
    confirmPassword: string | undefined;
    profilePhotoReceived: string | undefined;

    createdOn: Date = new Date();
    updatedOn: Date = new Date();

    convertToDTO(data: any) {
        this.userId = data.userId;
        this.email = data.email;
        this.name = data.name;
        this.currentPassword = data.currentPassword;
        this.newPassword = data.passwords.newPassword;
        this.confirmPassword = data.passwords.confirmPassword;
        this.phoneNumber = data.phoneNumber;
        this.mobileNumber = data.mobileNumber;
        this.address = data.address;
        this.profilePhotoReceived = data.profilePhotoReceived;
        this.createdOn = data.createdOn ? data.createdOn : new Date();
        this.updatedOn = new Date();
        this.createdBy = data.createdBy ? data.createdBy : 0;
        this.updatedBy = 0;
    }

    convertToNewDTO(data: any): ProfileDTO {
        let profileDTO: ProfileDTO = new ProfileDTO();
        profileDTO.userId = null;
        profileDTO.currentPassword = '';
        profileDTO.confirmPassword=''
        profileDTO.newPassword = '';
        profileDTO.createdOn = new Date();
        profileDTO.createdBy = 0;
        profileDTO.convertToDTO(data);
        return profileDTO;
    }
}
