var path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const config = require('../webhook.config.json')

class Webhooks {
    async webhooks(req, res, next) {
        res.json({
            message: 'Success'
        })
        const { name, git_url } = req.body.repository
        const { rootPath } = config
        // repository.name
        // repository.git_url
        const dirPath = path.join(rootPath, name)
        try {
           await fs.accessSync(dirPath) // 检查是否存在目录
        } catch(e) {
            // clone
           await execSync(`git clone ${git_url}`, {
               cwd: rootPath
           })
        }
        // 获取项目配置命令
        let projectConfig = JSON.parse(
            fs.readFileSync(`${dirPath}/webhook.config.json`).toString('utf-8')
        ) 
        

        await execSync('git pull', {
            cwd: dirPath
        })

        let commandsStr = [
            ...projectConfig.commands
        ].join(' & ')

        const targetDirPath = path.join(dirPath, projectConfig.rootPath)
        
        try {
            console.log('执行指令 ======== start ======')
            await execSync(commandsStr, {
                cwd: targetDirPath
            })
            console.log('执行指令 ======== end ======')
        } catch(e) {
            console.log('======')
            console.log(e)
            console.log('======')
        }
    }
}

module.exports = new Webhooks()