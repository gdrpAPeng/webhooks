var path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const config = require('../webhook.config.json')

class Webhooks {
    webhooks(req, res, next) {
        console.log('start')
        const { name, git_url } = req.body.repository
        const { rootPath, commands } = config
        // repository.name
        // repository.git_url
        const dirPath = path.join(rootPath, `/${name}`)
        try {
            fs.accessSync(dirPath) // 检查是否存在目录
        } catch(e) {
            // clone
            execSync(`cd ${rootPath} & git clone ${git_url}`)
        }
        
        let commandsStr = [
            `cd ${dirPath}`,
            `git pull`,
            ...commands
        ].join(' & ')
        console.log(commands)
        try {
            execSync(commandsStr)
            res.json({
                message: 'Success'
            })
        } catch(e) {
            console.log(e)
        }
        console.log('end === test')
    }
}

module.exports = new Webhooks()