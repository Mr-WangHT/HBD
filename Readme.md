WCH happy birthday!!!!

我要实现一个生日祝福网页给我的女朋友，主要用于手机打开，要竖屏布局
1，点开链接是一封可爱封面的信，点击印泥会出现一个问题：你是王昊天的什么人？只有回答宝宝，妹妹，老婆，才能打开信进入下一个页面。页面四个角有四个小狗图片放在了assets\dog\page1
2，打开信后出现可爱信纸，上面写着我对他说的话“生日快乐”等等，你先帮我填充上，并且告诉我我之后怎么更改，信的右下角是最爱你的哥哥，信的左下角有一个相册一样的图标可以点击，点击后进入下一个画面。
3，第三个页面会播放生日快乐歌，我自己唱的已经放在了assets\audio目录下，中文英文交替播放，生日快乐歌的背景音乐你可以自己找下么。然后各种我们的图片会接连出现在页面的各个地方，散乱一些，可以给图片加点边框，图片我放在了assets\images，爱心什么的形状你就自己画，也会偶尔交替出现在屏幕上，还有一些素材我放在了assets\dog\page3

问题：现在图片很多导致文件夹过大，能不能帮我找个合适的图床上传到云端

## 修改文案的位置

祝福信的内容在 `index.html` 里，搜索 `letter-content`，修改里面的 `<p>...</p>` 就可以。

右下角署名在 `index.html` 里，搜索 `signature`，修改“最爱你的哥哥”。

## 替换素材

第一页四角小狗：放在 `assets/dog/page1/`，并在 `index.html` 顶部四个 `corner-dog` 的 `src` 里改文件名。

第三页相册图片：放在 `assets/images/`，然后在 `js/main.js` 的 `photos` 数组里增删文件名。

第三页小狗素材：放在 `assets/dog/page3/`，然后在 `js/main.js` 的 `dogs` 数组里增删文件名。

生日歌音频：放在 `assets/audio/`，然后在 `js/main.js` 的 `tracks` 数组里修改播放顺序。

## 图片放云端的建议

如果图片很多，不建议全部塞进 Cloudflare Pages。Pages 单个静态文件最大 25 MiB，图片很多也会让仓库和部署变慢。

更合适的做法：

1. 网页代码继续放 Cloudflare Pages。
2. 大图放 Cloudflare R2，开启 public bucket 或绑定自定义域名，比如 `https://static.example.com/images/xxx.jpg`。
3. 如果想自动压缩、裁剪成手机尺寸，可以配合 Cloudflare Images 的 transformations 功能。
4. 上传完成后，把 `js/main.js` 里的 `photos` 数组从本地文件名改成完整图片 URL。

示例：

```js
const photos = [
  "https://static.example.com/images/photo-01.jpg",
  "https://static.example.com/images/photo-02.jpg"
];
```

如果继续使用本地目录，就保持现在这种写法：

```js
const photos = [
  "IMG_20240811_182805.jpg"
];
```

当前项目已经把第三页照片地址切到 R2 的压缩图目录：

```js
const r2PhotoBase = "https://pub-fc5bd537bb2c4bb59e8213eaf5b416bc.r2.dev/images-compressed/";
```

这表示图片在 R2 bucket 的 `images-compressed/` 目录，比如：

```text
https://pub-fc5bd537bb2c4bb59e8213eaf5b416bc.r2.dev/images-compressed/IMG_20240811_182805.jpg
```

本地兜底目录是：

```js
const localPhotoBase = "./assets/images-compressed/";
```

## 压缩图片

压缩脚本在 `tools/compress_images.py`。

运行：

```bash
python tools/compress_images.py
```

它会读取 `assets/images/` 原图，输出到 `assets/images-compressed/`，原图不会被修改。当前 32 张图片已经从约 135.68 MB 压缩到约 6.62 MB。

上传到 R2 时，把 `assets/images-compressed/` 里的图片上传到 bucket 的 `images-compressed/` 目录。

## 手写字体

原始字体放在：

```text
assets/fonts/XianSheng-GaiZenMeChengNi-2.ttf
```

网页实际加载的是子集压缩字体：

```text
assets/fonts/birthday-hand-subset.woff2
```

它只保留当前页面会用到的文字，已经从约 12.16 MB 压到约 45 KB。

如果以后大幅修改祝福文案，运行下面命令重新生成子集字体：

```bash
python tools/subset_font.py
```


## 信的内容
```text
给我最爱的宝宝：
    
```