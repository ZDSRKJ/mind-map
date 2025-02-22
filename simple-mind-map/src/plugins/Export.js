import {
  imgToDataUrl,
  downloadFile,
  readBlob,
  removeHTMLEntities,
  resizeImgSize
} from '../utils'
import { SVG } from '@svgdotjs/svg.js'
import drawBackgroundImageToCanvas from '../utils/simulateCSSBackgroundInCanvas'
import { transformToMarkdown } from '../parse/toMarkdown'
import { a4Size } from '../constants/constant'

//  导出插件
class Export {
  //  构造函数
  constructor(opt) {
    this.mindMap = opt.mindMap
  }

  //  导出
  async export(type, isDownload = true, name = '思维导图', ...args) {
    if (this[type]) {
      let result = await this[type](name, ...args)
      if (isDownload && type !== 'pdf') {
        downloadFile(result, name + '.' + type)
      }
      return result
    } else {
      return null
    }
  }

  //  获取svg数据
  async getSvgData() {
    let { exportPaddingX, exportPaddingY } = this.mindMap.opt
    let { svg, svgHTML } = this.mindMap.getSvgData({
      paddingX: exportPaddingX,
      paddingY: exportPaddingY
    })
    // 把图片的url转换成data:url类型，否则导出会丢失图片
    let imageList = svg.find('image')
    let task = imageList.map(async item => {
      let imgUlr = item.attr('href') || item.attr('xlink:href')
      // 已经是data:URL形式不用转换
      if (/^data:/.test(imgUlr) || imgUlr === 'none') {
        return
      }
      let imgData = await imgToDataUrl(imgUlr)
      item.attr('href', imgData)
    })
    await Promise.all(task)
    if (imageList.length > 0) {
      svgHTML = svg.svg()
    }
    return {
      node: svg,
      str: svgHTML
    }
  }

  //   svg转png
  svgToPng(
    svgSrc,
    transparent,
    checkRotate = () => {
      return false
    },
    compress
  ) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      // 跨域图片需要添加这个属性，否则画布被污染了无法导出图片
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas')
          const dpr = Math.max(
            window.devicePixelRatio,
            this.mindMap.opt.minExportImgCanvasScale
          )
          let imgWidth = img.width
          let imgHeight = img.height
          // 压缩图片
          if (compress) {
            const compressedSize = resizeImgSize(
              imgWidth,
              imgHeight,
              compress.width,
              compress.height
            )
            imgWidth = compressedSize[0]
            imgHeight = compressedSize[1]
          }
          // 如果宽比高长，那么旋转90度
          const needRotate = checkRotate(imgWidth, imgHeight)
          if (needRotate) {
            canvas.width = imgHeight * dpr
            canvas.height = imgWidth * dpr
            canvas.style.width = imgHeight + 'px'
            canvas.style.height = imgWidth + 'px'
          } else {
            canvas.width = imgWidth * dpr
            canvas.height = imgHeight * dpr
            canvas.style.width = imgWidth + 'px'
            canvas.style.height = imgHeight + 'px'
          }
          const ctx = canvas.getContext('2d')
          ctx.scale(dpr, dpr)
          if (needRotate) {
            ctx.rotate(0.5 * Math.PI)
            ctx.translate(0, -imgHeight)
          }
          // 绘制背景
          if (!transparent) {
            await this.drawBackgroundToCanvas(ctx, imgWidth, imgHeight)
          }
          // 图片绘制到canvas里
          ctx.drawImage(img, 0, 0, imgWidth, imgHeight)
          resolve(canvas.toDataURL())
        } catch (error) {
          reject(error)
        }
      }
      img.onerror = e => {
        reject(e)
      }
      img.src = svgSrc
    })
  }

  //  在canvas上绘制思维导图背景
  drawBackgroundToCanvas(ctx, width, height) {
    return new Promise((resolve, reject) => {
      let {
        backgroundColor = '#fff',
        backgroundImage,
        backgroundRepeat = 'no-repeat',
        backgroundPosition = 'center center',
        backgroundSize = 'cover'
      } = this.mindMap.themeConfig
      // 背景颜色
      ctx.save()
      ctx.rect(0, 0, width, height)
      ctx.fillStyle = backgroundColor
      ctx.fill()
      ctx.restore()
      // 背景图片
      if (backgroundImage && backgroundImage !== 'none') {
        ctx.save()
        drawBackgroundImageToCanvas(
          ctx,
          width,
          height,
          backgroundImage,
          {
            backgroundRepeat,
            backgroundPosition,
            backgroundSize
          },
          err => {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
            ctx.restore()
          }
        )
      } else {
        resolve()
      }
    })
  }

  //  在svg上绘制思维导图背景
  drawBackgroundToSvg(svg) {
    return new Promise(async resolve => {
      let {
        backgroundColor = '#fff',
        backgroundImage,
        backgroundRepeat = 'repeat'
      } = this.mindMap.themeConfig
      // 背景颜色
      svg.css('background-color', backgroundColor)
      // 背景图片
      if (backgroundImage && backgroundImage !== 'none') {
        let imgDataUrl = await imgToDataUrl(backgroundImage)
        svg.css('background-image', `url(${imgDataUrl})`)
        svg.css('background-repeat', backgroundRepeat)
        resolve()
      } else {
        resolve()
      }
    })
  }

  //  导出为png
  /**
   * 方法1.把svg的图片都转化成data:url格式，再转换
   * 方法2.把svg的图片提取出来再挨个绘制到canvas里，最后一起转换
   */
  async png(name, transparent = false, checkRotate, compress) {
    let { node, str } = await this.getSvgData()
    // 如果开启了富文本，则使用htmltocanvas转换为图片
    if (this.mindMap.richText) {
      // 覆盖html默认的样式
      let foreignObjectList = node.find('foreignObject')
      if (foreignObjectList.length > 0) {
        foreignObjectList[0].add(
          SVG(`<style>${this.mindMap.opt.resetCss}</style>`)
        )
      }
      str = node.svg()
      // 使用其他库（html2canvas、dom-to-image-more等）来完成导出
      // let res = await this.mindMap.richText.handleExportPng(node.node)
      // let imgDataUrl = await this.svgToPng(
      //   res,
      //   transparent,
      //   checkRotate
      // )
      // return imgDataUrl
    }
    str = removeHTMLEntities(str)
    // 转换成blob数据
    let blob = new Blob([str], {
      type: 'image/svg+xml'
    })
    // 转换成data:url数据
    let svgUrl = await readBlob(blob)
    // 绘制到canvas上
    let res = await this.svgToPng(svgUrl, transparent, checkRotate, compress)
    return res
  }

  //  导出为pdf
  async pdf(name, useMultiPageExport, maxImageWidth) {
    if (!this.mindMap.doExportPDF) {
      throw new Error('请注册ExportPDF插件')
    }
    let img = await this.png(
      '',
      false,
      (width, height) => {
        if (width <= a4Size.width && height && a4Size.height) return false
        return width / height > 1
      },
      {
        width: maxImageWidth || a4Size.width * 2
      }
    )
    await this.mindMap.doExportPDF.pdf(name, img, useMultiPageExport)
  }

  // 导出为xmind
  async xmind(name) {
    if (!this.mindMap.doExportXMind) {
      throw new Error('请注册ExportXMind插件')
    }
    const data = this.mindMap.getData()
    const blob = await this.mindMap.doExportXMind.xmind(data, name)
    const res = await readBlob(blob)
    return res
  }

  //  导出为svg
  // plusCssText：附加的css样式，如果svg中存在dom节点，想要设置一些针对节点的样式可以通过这个参数传入
  async svg(name) {
    let { node } = await this.getSvgData()
    // 开启了节点富文本编辑
    if (this.mindMap.richText) {
      let foreignObjectList = node.find('foreignObject')
      if (foreignObjectList.length > 0) {
        foreignObjectList[0].add(
          SVG(`<style>${this.mindMap.opt.resetCss}</style>`)
        )
      }
    }
    node.first().before(SVG(`<title>${name}</title>`))
    await this.drawBackgroundToSvg(node)
    let str = node.svg()
    str = removeHTMLEntities(str)
    // 转换成blob数据
    let blob = new Blob([str], {
      type: 'image/svg+xml'
    })
    let res = await readBlob(blob)
    return res
  }

  //  导出为json
  async json(name, withConfig = true) {
    let data = this.mindMap.getData(withConfig)
    let str = JSON.stringify(data)
    let blob = new Blob([str])
    let res = await readBlob(blob)
    return res
  }

  //  专有文件，其实就是json文件
  async smm(name, withConfig) {
    let res = await this.json(name, withConfig)
    return res
  }

  // markdown文件
  async md() {
    let data = this.mindMap.getData()
    let content = transformToMarkdown(data)
    let blob = new Blob([content])
    let res = await readBlob(blob)
    return res
  }
}

Export.instanceName = 'doExport'

export default Export
