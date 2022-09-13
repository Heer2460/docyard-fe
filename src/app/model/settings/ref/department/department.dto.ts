import {BaseDTO} from "../../../base.dto";

export class DepartmentDTO extends BaseDTO {

    id: null | undefined;
    code: string | undefined;
    name: string | undefined;
    status: string | undefined;
    createdOn: Date = new Date();
    updatedOn: Date = new Date();

    convertToDTO(data: any) {
        this.id = data.id;
        this.code = data.code;
        this.name = data.name;
        this.status = data.status;

        this.createdOn = data.createdOn ? data.createdOn : new Date();
        this.updatedOn = new Date();
        this.createdBy = data.createdBy ? data.createdBy : 0;
        this.updatedBy = 0;
    }

    convertToNewDTO(data: any): DepartmentDTO {
        let departmentDTO: DepartmentDTO = new DepartmentDTO();
        departmentDTO.id = null;
        departmentDTO.createdOn = new Date();
        departmentDTO.createdBy = 0;
        departmentDTO.convertToDTO(data);
        return departmentDTO;
    }

}
