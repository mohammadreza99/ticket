import {Pipe, PipeTransform} from "@angular/core";
import * as moment from "jalali-moment";

@Pipe({
    name: 'jalalitime'
})
export class JalaliTimePipe implements PipeTransform {
    
    transform(value: any, args: string = 'jYYYY/jM/jD HH:mm:ss'): any {
        if (value == null) {
            return null;
        }
        const MomentDate = moment(new Date(value));
        return MomentDate.locale('fa').format(args);
    }
}
