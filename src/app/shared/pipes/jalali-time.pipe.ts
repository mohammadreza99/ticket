import {Pipe, PipeTransform} from "@angular/core";
import * as moment from "jalali-moment";

@Pipe({
    name: 'jalalitime'
})
export class JalaliTimePipe implements PipeTransform {
    transform(value: any, args: string = 'YYYY/M/D HH:mm:ss'): any {
        if (value == null) {
            return null;
        }
        const MomentDate = moment(value);
        return MomentDate.locale('fa').format(args);
    }
}
