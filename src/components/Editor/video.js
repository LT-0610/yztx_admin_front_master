import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')
const Link = Quill.import('formats/link')

class Video extends BlockEmbed {
  static create(value) {
    const node = super.create(value)
    node.setAttribute('controls', 'controls')
    node.setAttribute('src', this.sanitize(value))
    // nofullscreen 不要全屏按钮
    // nodownload 不要下载按钮
    // noremoteplayback 不要远程回放
    node.setAttribute('controlsList', 'nodownload noremoteplayback') // 控制删除
    node.setAttribute('type', 'video/mp4')
    node.setAttribute('style', 'object-fit:fill;width: 100%;')
    node.setAttribute('preload', 'auto')    // auto - 当页面加载后载入整个视频  meta - 当页面加载后只载入元数据  none - 当页面加载后不载入视频
    node.setAttribute('playsinline', 'true')
    node.setAttribute('x-webkit-airplay', 'allow')
    // node.setAttribute('x5-video-player-type', 'h5') // 启用H5播放器,是wechat安卓版特性
    node.setAttribute('x5-video-orientation', 'portraint') // 竖屏播放 声明了h5才能使用  播放器支付的方向，landscape横屏，portraint竖屏，默认值为竖屏
    node.setAttribute('x5-playsinline', 'true') // 兼容安卓 不全屏播放
    node.setAttribute('x5-video-player-fullscreen', 'true')
    return node
  }

  static sanitize(url) {
    return Link.sanitize(url)
  }

  static value(domNode) {
    return domNode.getAttribute('src')
  }

  format(name, value) {
    super.format(name, value)
  }

}
Video.blotName = 'video'
Video.className = 'ql-video'
Video.tagName = 'video'

export default Video
