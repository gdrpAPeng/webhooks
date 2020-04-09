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
        res.json({
            message: 'Success',
            config: projectConfig,
            target: path.join(dirPath, projectConfig.rootPath)
        })

        await execSync('git pull', {
            cwd: dirPath
        })

        

        let commandsStr = [
            ...projectConfig.commands
        ].join(' & ')

        // let targetDirPath = dirPath
        // if(projectConfig.rootPath) {
        //     targetDirPath = path.join(targetDirPath, projectConfig.rootPath)
        // }

        const targetDirPath = path.join(dirPath, projectConfig.rootPath)
        
        console.log(targetDirPath, '===')
        try {
            await execSync(commandsStr, {
                cwd: targetDirPath
            })
        } catch(e) {
            console.log('======')
            console.log(e)
            console.log('======')
        }
    }
}

module.exports = new Webhooks()