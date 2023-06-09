import {BaseDTO} from "../../base.dto";

export class DlDocumentDTO extends BaseDTO {

    id: null | undefined;
    name: string | undefined;
    title: string | undefined;
    extension: string = '';
    parentId: null | undefined;
    daysArchived: number = 0;
    shared: boolean = false;
    folder?: boolean;
    versionGUId?: number;
    createdOn: Date = new Date();
    updatedOn: Date = new Date();
    checkedInBy: number | undefined;
    checkedIn?: boolean;

    convertToDTO(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.shared = data.shared;
        this.extension = data.extension;
        this.daysArchived = data.daysArchived ? data.daysArchived : 0;
        this.title = data.name;
        this.createdOn = data.createdOn ? data.createdOn : new Date();
        this.updatedOn = new Date();
        this.createdBy = data.createdBy ? data.createdBy : 0;
        this.updatedBy = 0;
        this.checkedIn = data.checkedIn;
        this.checkedInBy = data.checkedInBy;
    }

    convertToNewDTO(data: any): DlDocumentDTO {
        let dlDoc: DlDocumentDTO = new DlDocumentDTO();
        dlDoc.convertToDTO(data);

        return dlDoc;
    }

}
