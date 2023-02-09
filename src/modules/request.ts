    import { endpoint, methods, Request, Response } from '@moduletypes/types'
import { makeId } from '@utils/make_id'
import {ChildProcess, fork}  from 'child_process'
import delay from "delay";
export class JsonRequest{
    #server:ChildProcess
    #messages: Map<string, Response>
    #ready:boolean
    endpoints: { [key: string]: string[] }
    #timeout = 100000;
    constructor(location:string){
        this.#messages = new Map()
        this.#ready = false;
        this.endpoints = {}
       this.#server= fork(location, ['child'], {
            stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
        })
        this.#server.on('spawn',()=>{
            this.#server.send(JSON.stringify(this.#createRequest('get', 'endpoints', '')))           
        })
        this.#server.on("message",this.#parseMessages)
        
    }
    #parseMessages(m:string){
        var message: Response = JSON.parse(m);
        if(message.endpoint == 'endpoints' && message.body){
            this.endpoints = JSON.parse(message.body);
            this.#ready = true
            return;
        }
        this.#messages.set(message.id, message)
    }
    #createRequest(method:methods,endpoint:endpoint, body?:string):Request{
        return {
            id:makeId(10),
            body:body? body: "",
            endpoint:endpoint,
            method:method,
        }
    }
    setTimeout(ms:number){
        this.#timeout = ms
    }
    async get(endpoint:string, body?:string){
        var req =  this.#createRequest('get', endpoint, body)
        return await this.#sendRequest(req)
    }
    async post(endpoint:string, body?:string){
        var req = this.#createRequest('post', endpoint, body)
        return await this.#sendRequest(req)
    }
    async del(endpoint:string, body?:string){
        var req = this.#createRequest('del', endpoint, body)
        return await this.#sendRequest(req)
    }
    async #sendRequest(m:Request):Promise<Response>{
        while(!this.#ready){
            await delay(100)
        }
        if(!this.endpoints[m.method].includes(m.endpoint)){
            throw new Error(`Ipc doesnt contain endpoint ${m.endpoint} on method ${m.method}`)
        }
        this.#server.send(JSON.stringify(m))
        var now = 0;
        while(this.#messages.get(m.id) == undefined && now < this.#timeout){
            await delay(1);
            now++;
        }
        if(now >= this.#timeout){
            throw new Error(`Request ${m.id} Timeout ${now} `)
        }
        var response = this.#messages.get(m.id)
        if(response == undefined){
            throw new Error(`Request ${m.id} returned null `)
        }
        return response
    }
}