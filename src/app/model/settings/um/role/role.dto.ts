import {BaseDTO} from "../../../base.dto";

export class RoleDTO extends BaseDTO {

    id: null | undefined;
    code: string | undefined;
    name: string | undefined;
    status: string | undefined;
    remarks: string | undefined;
    createdOn: Date = new Date();
    updatedOn: Date = new Date();

    convertToDTO(data: any) {
        this.id = data.id;
        this.code = data.code;
        this.name = data.name;
        this.status = data.status;
        this.remarks = data.remarks;

        this.createdOn = data.createdOn ? data.createdOn : new Date();
        this.updatedOn = new Date();
        this.createdBy = data.createdBy ? data.createdBy : 0;
        this.updatedBy = 0;
    }

    convertToNewDTO(data: any): RoleDTO {
        let roleDTO: RoleDTO = new RoleDTO();
        roleDTO.id = null;
        roleDTO.createdOn = new Date();
        roleDTO.createdBy = 0;
        roleDTO.convertToDTO(data);
        return roleDTO;
    }

}
