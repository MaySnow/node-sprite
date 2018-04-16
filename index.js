/**
 * Created by may on 16/04/2018.
 */
const config = require('./config')
let _argv

try {
  _argv = JSON.parse(process.env.npm_config_argv).original
} catch (ex) {
  _argv = process.argv
}

let matched = _argv.join(' ').split('run sprite ')
if (!matched || !matched[1]) {
  console.log(`请输入图片名称和在img文件下的要合成的图片的文件夹名`)
  return
}
matched = matched[1].split(' ')

if(matched.length < 2) {
  console.log(`请至少输入图片名称和在img文件下的要合成的图片的文件夹名两个参数`)
  return
}

config(matched)
