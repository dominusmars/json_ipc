const { JsonIpc } = require('@modules/jsonipc')
const { fork } = require('child_process')

if (process.argv[2] == 'child') {
    const application = new JsonIpc()

    application.set('get', 'test', async (req, res) => {
        res("hello word")

    })
    application.debugging()
} else {
    var child = fork(__filename, ['child'], {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    })
    child.on('spawn', async () => {
        console.log('spawned')
        setTimeout(() => {
            child.send(JSON.stringify({
                id: "hello",
                method: 'get',
                endpoint: 'test'
            }))
            child.send(JSON.stringify({
                id: "hello",
                method: 'get',
                endpoint: "endpoints"
            }))
        }, 1000)

    })
    child.on('message', (m) => {
        console.log('got ' + m)
    })
    child.on("error", (e) => {
        console.log(e)
    })

}
