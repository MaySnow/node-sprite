# node-sprite
create sprite image and css by node

## 使用

```
npm install
```

```
npm run sprite 图片名称 在img文件下的要合成的图片的文件夹名 [图片排列方向] [是否使用布局的算法]
```】

例如：

```
npm run sprite invite-share-icon invite
```

```
npm run sprite loading-icon loading top-down false
```

可以打开 sprite/dist子文件下的inde.html 查看生成的图片和class

## 具体参数参考如下：

1、[spritesmith](https://github.com/Ensighten/spritesmith)

2、[create-html](https://github.com/sethvincent/create-html)