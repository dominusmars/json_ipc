import { log_type } from '@moduletypes/logging_types';
import { Response, status } from '@moduletypes/types';
import 'colors'


export function log(message:string, type?:log_type){
    switch (type) {
        case 'debug':
            break;
        case 'error':
            break;
        case 'log':
            break;
        case 'warn':
            break;
        default:
            break;
    }
}

export async function logResponse(res: Response){
    var str =statusToString(res.status)+ " " + res.method.toUpperCase() +  " " + res.endpoint +  " " + (res.body? res.body.length: 0)+  " "  + res.ms +" ms"
    console.log(str)
}

function statusToString(status:status):string{
    switch(status){
        case 200:
            return '200'.green
            case 404:
                return '404'.red
            case 500:
                return '500'.red
        default:
            return "200".green
    }
}