import {BaseDTO} from "../../../base.dto";

export class GroupDTO extends BaseDTO {

    id: null | undefined;
    code: string | undefined;
    name: string | undefined;
    status: string | undefined;
    role: string | undefined;
    rolesNameList:  string | undefined;
    remarks: string | undefined;
    createdOn: Date = new Date();
    updatedOn: Date = new Date();

    convertToDTO(data: any) {
        this.id = data.id;
        this.code = data.code;
        this.name = data.name;
        this.status = data.status;
        this.rolesNameList = data.rolesNameList
        this.role = data.role;
        this.remarks = data.remarks;
        this.createdOn = data.createdOn ? data.createdOn : new Date();
        this.updatedOn = new Date();
        this.createdBy = data.createdBy ? data.createdBy : 0;
        this.updatedBy = 0;
    }

    convertToNewDTO(data: any): GroupDTO {
        let groupDTO: GroupDTO = new GroupDTO();
        groupDTO.id = null;
        groupDTO.createdOn = new Date();
        groupDTO.createdBy = 0;
        groupDTO.convertToDTO(data);
        return groupDTO;
    }

}
