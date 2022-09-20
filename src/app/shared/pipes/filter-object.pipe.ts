import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterObject'
})
export class FilterObjectPipe implements PipeTransform {

    transform(...args: any[]): any {

        let id: any, type: string = '', array: Array<any>;
        id = args[0];
        array = args[1];
        type = args[2];

        if (type === 'single') {
            return array.find((item: any) => Number(id) === item.id)?.name;
        } else {
            let departNames: any[] = [];
                id?.map((objId: any) => {
                    array.filter((item: any) => {
                        if (Number(objId) === item.id) {
                            departNames.push(item.name);
                        }
                    });
                });
                return departNames.join(', ');
        }
    }

}
