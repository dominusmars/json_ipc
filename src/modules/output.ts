import { Response } from '@moduletypes/types';
import { logResponse } from '@outs/routeLogger';
import 'process';

export async function send(m:Response | string,debug?:boolean):Promise<Boolean>{
    if (!process || process == undefined ){
        return false;
    }
    if(!process.send){
        return false;
    }
    if(typeof m == 'string'){
        process.send(m);
        return true;
    }
    debug && logResponse(m)


    process.send(JSON.stringify(m));
    return true
}