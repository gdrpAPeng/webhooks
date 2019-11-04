var path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const config = require('../webhook.config.json')

class Webhooks {
    async webhooks(req, res, next) {
        console.log('start ==== start')
        const { name, git_url } = req.body.repository
        const { rootPath, commands } = config
        // repository.name
        // repository.git_url
        const dirPath = path.join(rootPath, `/${name}`)
        try {
           await fs.accessSync(dirPath) // 检查是否存在目录
        } catch(e) {
            // clone
           await execSync(`cd ${rootPath} & git clone ${git_url}`)
        }
        
        let commandsStr = [
            `cd ${dirPath}`,
            `git pull`,
            ...commands
        ].join(' & ')
        console.log(commands)
        try {
           await execSync(commandsStr)
            res.json({
                message: 'Success'
            })
        } catch(e) {
            console.log(e)
        }
        console.log('应该有了 === 测试 github push == restart?')
        // res.json({
        //     end: true
        // })
    }
}

module.exports = new Webhooks()