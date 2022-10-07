import {BaseDTO} from "../../base.dto";

export class DlDocumentDTO extends BaseDTO {

    id: null | undefined;
    name: string | undefined;
    title: string | undefined;
    parentId: null | undefined;
    folder?: boolean;
    createdOn: Date = new Date();
    updatedOn: Date = new Date();

    convertToDTO(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.title = data.name;
        this.createdOn = data.createdOn ? data.createdOn : new Date();
        this.updatedOn = new Date();
        this.createdBy = data.createdBy ? data.createdBy : 0;
        this.updatedBy = 0;
    }

    convertToNewDTO(data: any): DlDocumentDTO {
        let dlDoc: DlDocumentDTO = new DlDocumentDTO();
        dlDoc.convertToDTO(data);

        return dlDoc;
    }

}
