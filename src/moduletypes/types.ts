// types.d.ts
export type Request = {
    id:string
    method:methods
    endpoint:endpoint
    body:string
    error?:string
}
export type methods = "get" |"post" | "del"
export type status = 404 |200|500 |201
export type endpoint = string;
export type Response = {
    id:string
    res:Request
    method:methods
    endpoint:endpoint
    body?:string
    status:status
    ms?:number
}
export type ResponseError = {
    method:methods
    endpoint:endpoint
    body:string
    status:status
}

export type res =  (body?:any, status?:status)=>
void
export type route = (res:Request, req:res)=> void;

