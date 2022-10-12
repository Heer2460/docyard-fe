export class ChangePasswordDTO {

    userId: number = 0;
    currentPassword: string = '';
    newPassword: string = '';
    token: string = '';

    convertToDTO(data: any) {
        this.userId = data.userId;
        this.newPassword = data.password;
        this.currentPassword = data.currentPassword;
    }

    convertToNewDTO(data: any): ChangePasswordDTO {
        let cpDTO: ChangePasswordDTO = new ChangePasswordDTO();
        cpDTO.convertToDTO(data);
        return cpDTO;
    }

}
