import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import cls from 'classnames'
import { gameList } from '@/game'
import signJson from '@/SignIn'
import './index.less'

// 在页面中定义激励视频广告
let videoAd = null
const prefixCls = 'games'
export default class Index extends Component {

  config = {
    navigationBarTitleText: '游戏列表'
  }

  constructor(props) {
    super(props)
    this.state = {
      gameList: [],
      couponList: [],
      isSignIn: false
    }
  }

  componentWillMount() { }

  componentDidMount() {
    const _this = this
    this.setState({
      gameList: gameList,
      couponList: signJson.couponList
    })
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-e3512a24023f0d5b'
      })
      // videoAd.onLoad(() => { })
      videoAd.onError((err) => {
        console.log(err)
    })
      videoAd.onClose((res) => {
        if (res.isEnded) {
          _this.setState({
            isSignIn: true
          })
        }
      })
    }

    // wx.request({
    //   url: 'http://129.211.174.129/SignIn.json', //仅为示例，并非真实的接口地址
    //   data: {},
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     _this.setState({
    //       couponList: res.data.couponList
    //     })
    //   }
    // })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  clickGameName(item) {
    Taro.navigateTo({
      url: '/pages/gameDetail/index?detail=' + JSON.stringify(item.children)
    })
  }

  signIn() {
    if (videoAd) {
      Taro.showLoading({
        title: '加载中...'
      });
      videoAd.show().then(() => {
        Taro.hideLoading();
      }).catch(() => {
        Taro.hideLoading();
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            Taro.showToast({
              title: '加载失败，请重试',
              icon: 'none'
            })
          })
      })
    }
  }

  render() {
    const { gameList, couponList, isSignIn } = this.state
    const now = (new Date()).getDate();
    return (
      <View className={cls(prefixCls)}>
        <View className='tips'>请勿在短时间内多次重复查看密码，查看失败后请更换账号或等待一段时间查看.</View>
        <View className={cls(`${prefixCls}-list`)} onClick={this.signIn.bind(this)}>
          点击签到获取兑换码{isSignIn ? couponList[now - 1]
            : <Image src={require('../../assets/img/video.png')} mode='widthFix' className='video'></Image>}
        </View>
        {
          gameList.map(item => {
            return <View key={item.id} className={cls(`${prefixCls}-list`)} onClick={this.clickGameName.bind(this, item)}>{item.gameName}</View>
          })
        }
        <View className='adver'>
          <ad unit-id="adunit-d9d4a7929afd768d"></ad>
        </View>
      </View>
    )
  }
}
