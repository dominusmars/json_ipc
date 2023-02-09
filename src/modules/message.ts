import { Request, Response, status } from "@moduletypes/types"
import { makeId } from "@utils/make_id"


export function parseMessage(m: string):Request | false {
    try {
        var message = JSON.parse(m)
        if(!message.id){
            message.id = makeId(10)
        }
       
        return message
    } catch (error: any) {
        return false
    }
} 
export function createResponse(m:Request,status?:status, body?:string, ms?:number):Response{
    return{
        id: m.id,
        res:m,
        method:m.method,
        body:body? body: "",
        status:status? status: 200,
        endpoint:m.endpoint,
        ms:ms
    }
}