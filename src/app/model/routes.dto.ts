export class RoutesDTO {
    label: string = '';
    route: string = '';
    icon: string = '';
    children?: RoutesDTO[] = [];
    active?: boolean = false
}
