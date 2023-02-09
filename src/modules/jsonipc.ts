import { endpoint, methods, Request, Response, route, status } from '@moduletypes/types'
import { error } from "console"
import { createResponse, parseMessage } from './message'
import { logResponse } from '@outs/routeLogger'
import { send } from './output'
import EventEmitter from 'events'
import delay from 'delay'

function invalidRequest(error:string):string{
    return JSON.stringify( {
        'body': error,
        'status': 500,
    })
}


export class JsonIpc extends EventEmitter{
    #routes: Map<methods, Map<endpoint, route>>
    #debug: boolean 
    #ready: boolean
    constructor(){
        super()
        this.#routes = new Map();
        this.#debug = false;
        this.#ready = false;
        if (!process || process == undefined ){
            throw new Error("Not a Node Process ")
        }
        if(!process.send){
            throw new Error("Ipc not connected")
        }

        process.on('message', async (m :string) => {
            while(!this.#ready){
                await delay(100)
            }
            var then = Date.now()
            if (!process || process == undefined ){
                throw new Error("Not a Node Process ")
            }
            if(!process.send){
                throw new Error("Ipc not connected")
            }
            var message = parseMessage(m)
            if(!message){
                send(invalidRequest("Unable to parse Message"))
                return;
            }
        
            if(!message.method || !message.endpoint){
                send(invalidRequest("Unable to read Message"));
                return;
            }

            if(!this.#routes.has(message.method)){
                send(invalidRequest("Invalid Method"))
                return;
            }
            var route = this.#routes.get(message.method)
            if(!route?.has(message.endpoint)){
                return send(invalidRequest("Invalid Endpoint"))
            }
            var func = route.get(message.endpoint)
            if(func == undefined){
                return send(invalidRequest("Invalid Endpoint"));
            }
            try {
                func(message, this.response.bind(this, message,then))
            } catch (error) {
                console.log(error)
            }
        })
        this.set('get', 'endpoints', (res,req)=>{
            req(this.api(),200)
        })
    }
    listen(){
        this.#ready = true;
    }
    response(m:Request,ms:number, body?:any, status?:status){
        if (!process || process == undefined ){
            throw new Error("Not a Node Process ")
        }
        if(!process.send){
            throw new Error("Ipc not connected")
        }
        if(!body){
            body = "";
        }
        if(typeof body != 'string'){
            body = JSON.stringify(body)
        }
        var now = Date.now()
        send(createResponse(m,status,body, now - ms),this.#debug)
    }
    debugging(){
        this.#debug = true;
    }
    get(endpoint:endpoint, func:route){
        var method = this.#routes.get('get')
        if(!method){
            this.#routes.set('get', new Map())
        }
        method = this.#routes.get('get')
        method?.set(endpoint,func)
    }
    post(endpoint:endpoint, func:route){
        var method = this.#routes.get('post')
        if(!method){
            this.#routes.set('post', new Map())
        }
        method = this.#routes.get('post')
        method?.set(endpoint,func)
    }
    del(endpoint:endpoint, func:route){
        var method = this.#routes.get('del')
        if(!method){
            this.#routes.set('del', new Map())
        }
        method = this.#routes.get('del')
        method?.set(endpoint,func)
    }
    set(method:methods, endpoint:endpoint, func: route){
        var methodRoute = this.#routes.get(method)
        if(!methodRoute){
            this.#routes.set(method, new Map())
        }
        methodRoute = this.#routes.get(method)
        methodRoute?.set(endpoint,func)

    }
    endpoints():Array<string>{
        var routes: string[] = []    
      
        let routeList = [];
        for (let method of Object.keys(this.#routes)) {
            if(method != 'get'&&method != 'post'&&method != 'del'){
                continue;
            }
            var route = this.#routes.get(method)
            if(!route){
                continue
            }
            for (let endpoint of Object.keys(route)) {
                routeList.push(`${method} ${endpoint}`);
            }
        }
    return routeList;
        return routes
    }
    api(): { [key: string]: string[] } {
        let result: { [key: string]: string[] } = {};
        for (let method of Array.from(this.#routes.keys())) {
            result[method] = Array.from(this.#routes.get(method)?.keys() || []);
        }
        return result;
    }

}
