export class RoutesDTO {
    label: string = '';
    route: string = '';
    icon: string = '';
    children?: RoutesDTO[] = [];
    expended: boolean = false
    active: boolean = false
}
