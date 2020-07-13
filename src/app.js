import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/gameDetail/index',
      'pages/web/index',
      'pages/coupon/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#666666',
      selectedColor: '#53becc',
      list: [
        {
        pagePath: 'pages/index/index',
        text: "游戏",
        iconPath: './assets/img/mine.png',
        selectedIconPath: './assets/img/mine_a.png'
      },
      {
        pagePath: 'pages/coupon/index',
        text: "抽奖",
        iconPath: './assets/img/web.png',
        selectedIconPath: './assets/img/web_a.png'
      },
      ]
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
