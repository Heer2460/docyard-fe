import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, limit = 30, ellipsis = '...') {
        // return value.length > limit ? value.substring(0, limit) + ellipsis : value;
        return value.length > limit ? value.split('.').slice(0, -1).join('.').substring(0, limit) + ellipsis : value;
    }
}
