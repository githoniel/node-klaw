
const path = require('path')
const klaw = require('../src')
const through2 = require('through2')
/**
 * 遍历目录下所有文件，排除文件夹
 * @param {} dir 目录路径
 */
async function getFileListFromDir(dir) {
    return new Promise((resolve) => {
        const excludeDirFilter = through2.obj(function filter(item, enc, next) {
            if (item.stats && !item.stats.isDirectory() && path.basename(item.path) !== '.gitkeep') {
                this.push(item)
            }
            next()
        })
        const items = []
        klaw(dir, {
            depthLimit: 0
        })
            .on('error', (err, item) => {
                console.log(err.message)
                console.log(item.path) // the file the error occurred on
            })
            .pipe(excludeDirFilter)
            .on('data', item => items.push(item.path))
            .on('end', () => {
                resolve(items)
            })
    })
}

getFileListFromDir('c:\\').catch((e) => {
    debugger
}).then((item) => {
    console.log(item)
})