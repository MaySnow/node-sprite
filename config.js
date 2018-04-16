// Load in dependencies
const path = require('path');
const fs = require('fs');
const Spritesmith = require('spritesmith');
const Absurd = require('absurd');
const createHTML = require('create-html');
let api = Absurd();

/**
 * 合成雪碧图
 * @param matched [图片名称, 在img文件下的要合成的图片的文件夹名, 图片排列方向, 是否使用布局的算法]
 * Spritesmith 参数参考：https://github.com/Ensighten/spritesmith
 */
module.exports = function (matched) {
  let cssName = matched[0];
  let imgPath = matched[1];
  let algorithm = matched[2]
  let sort = matched.length >= 4 ? matched[3] === 'true' : true

  let entryObj = [];
  const glob = require('glob');
  let files = glob.sync('**/*', {
    cwd: path.join(__dirname, 'img/' + imgPath)
  });

  let distPath = path.join(__dirname, `dist/${imgPath}`)

  if(!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'));
  }

  if(!fs.existsSync(distPath)) {
    fs.mkdirSync(path.join(distPath));
  }

  files.forEach(function (file) {
    entryObj.push(path.join(__dirname, 'img/' + imgPath + '/') + file);
  });
// Generate our spritesheet
  Spritesmith.run({
    src: entryObj,
    padding: 10,
    algorithm: (algorithm ? algorithm : 'binary-tree'),
    algorithmOpts: {sort: sort}
  }, function handleResult(err, result) {
    // If there was an error, throw it
    if (err) {
      throw err;
    }
// Output the image
    fs.writeFileSync(`${distPath}/${cssName}.png`, result.image);
    console.log('--------生成图片成功')


    let cssBg = {};
    cssBg['.' + cssName] = {
      'background-image': `url("./${cssName}.png")`,
      'background-repeat': 'no-repeat',
      'display': 'inline-block'
    };

    let iconHtml = ``

    let coordinates = result.coordinates;
    for (let coo in coordinates) {
      if (coordinates.hasOwnProperty(coo)) {
        let curItem = coordinates[coo];
        let iconName = '.' + imgPath + '-' + coo.substring(coo.lastIndexOf('/') + 1);
        iconName = iconName.substring(0, iconName.lastIndexOf('.'));
        cssBg[iconName] = {
          'background-position': -1 * curItem.x + 'px ' + -1 * curItem.y + 'px',
          'width': curItem.width + 'px',
          'height': curItem.height + 'px'
        };
        iconHtml += `<li>
              <i class="${cssName} ${iconName.substring(1)}"></i>
              <p>${iconName}</p>
            </li>`
      }
    }

    api.add(cssBg);
    api.compile(function (err, css) {
      // use the compiled css
      fs.writeFileSync(`${distPath}/${cssName}.css`, css);
      console.log('--------生成css成功')
      renderHtml(cssName,iconHtml,function () {
        console.log('--------生成html成功')
        console.log('-------done');
        console.log(`原图片的路径为：${imgPath}`)
        console.log(`生成css的名称为：${cssName}`)
        console.log(`生成img雪碧图的的名称为：${cssName}.png`)
        console.log(`是否使用布局算法：${sort ? '是' : '否'}`)
      })
    });


    function renderHtml(cssName,iconHtml,cb) {
      let html = createHTML({
        title: cssName,
        script: '../../static/base.js',
        css: ['../../static/base.css',`${cssName}.css`],
        head: `<meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
        <meta name="renderer" content="webkit"/>
        <meta content="yes" name="apple-mobile-web-app-capable"/>`,
        body: `<div class="ui-container"><ul class="icon-list">${iconHtml}</ul></div>`
      })
      fs.writeFile(`${distPath}/index.html`, html, function (err) {
        if (err) {
          console.log(err)
          return
        }
        cb()
      })
    }



  });
};

