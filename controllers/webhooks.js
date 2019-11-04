var path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const config = require('../webhook.config.json')

class Webhooks {
    async webhooks(req, res, next) {
        const { name, git_url } = req.body.repository
        const { rootPath } = config
        // repository.name
        // repository.git_url
        const dirPath = path.join(rootPath, `/${name}`)
        try {
           await fs.accessSync(dirPath) // 检查是否存在目录
        } catch(e) {
            // clone
           await execSync(`git clone ${git_url}`, {
               cwd: rootPath
           })
        }

        // 获取项目配置命令
        let commands = JSON.parse(
            fs.readFileSync(`${dirPath}/webhook.config.json`).toString('utf-8')
        ) 

        let commandsStr = [
            `git pull`,
            ...commands
        ].join(' & ')

        try {
            await execSync(commandsStr, {
                cwd: dirPath
            })
            res.json({
                message: 'Success'
            })
        } catch(e) {
            console.log(e)
        }
    }
}

module.exports = new Webhooks()