class Webhooks {
    webhooks(req, res, next) {
        // 获取到项目名
        // 存在 - 更新代码
        // 不存在则克隆
        // 进入目录
        // 读取配置文件数据，根据项目执行命令
        console.log(req.body)
        console.log('控制器啊啊啊啊啊啊')
        res.json(req.body)
    }
}

module.exports = new Webhooks()