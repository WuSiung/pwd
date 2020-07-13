import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import cls from 'classnames'
import { gameList } from '@/game'
import './index.less'

const prefixCls = 'web'
export default class Web extends Component {

  config = {
    navigationBarTitleText: '官网'
  }

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() { }

  componentDidMount() {
    this.setState({
      gameList: gameList
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  copyWebUrl(){
      Taro.setClipboardData({
        data: 'https://azz.net/veronica',
        success: res=>{
            console.log(res)
        }
    })
  }

  render() {
    return (
      <View className={cls(prefixCls)} onClick={this.copyWebUrl.bind(this)}>
          官网地址： <Text className={cls(`${prefixCls}-url`)}>https://azz.net/veronica</Text>
          (点击复制前往浏览器查看)
      </View>
    )
  }
}
