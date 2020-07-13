import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAccordion, AtList, AtListItem } from 'taro-ui'
import cls from 'classnames'
import './index.less'

const prefixCls = 'game-detail'

// 在页面中定义激励视频广告
let videoAd = null
let clickIndex = 0
export default class gameDetail extends Component {

    config = {
        navigationBarTitleText: '获取密码'
    }

    constructor(props) {
        super(props)
        this.state = {
            gameDetail: []
        }
    }

    componentWillMount() { }

    componentDidMount() {
        let _this = this
        this.setState({
            gameDetail: JSON.parse(this.$router.params.detail)
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
                    let { gameDetail } = _this.state
                    gameDetail[clickIndex].checked = true
                    _this.setState({
                        gameDetail: gameDetail
                    })
                }
            })
        }
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    seePassword(item, i) {
        let _this = this
        clickIndex = i
        // 链接将不查看密码 跳转至链接 目前仅支持B站，不进行广告观看
        if (item.isUrl) {
            Taro.setClipboardData({
                data: item.url,
                success: res => {
                    wx.showToast({
                        title: '复制成功,请前往浏览器查看',
                        icon: 'none'
                    })
                }
            })
            return
        }


        // 用户触发广告后，显示激励视频广告
        if (videoAd && !item.noAdver) {
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
        } else {
            let { gameDetail } = _this.state
            gameDetail[i].checked = true
            _this.setState({
                gameDetail: gameDetail
            })
        }
    }

    copyPassword(item) {
        if (!item.checked) return
        Taro.setClipboardData({
            data: item.password,
            success: res => {
                wx.showToast({
                    title: '复制成功'
                })
            }
        })
    }

    render() {
        const { gameDetail } = this.state
        return (
            <View className={cls(prefixCls)}>
                <View className='tips'>请勿在短时间内多次重复查看密码，查看失败后请更换账号或等待一段时间查看.</View>
                {
                    gameDetail.map((item, index) => {
                        return <View className={cls(`${prefixCls}-item`)} key={item.passwordName} onLongPress={this.copyPassword.bind(this, item)}
                            onClick={this.seePassword.bind(this, item, index)}>{item.passwordName}
                            {
                                item.checked ? '（' + item.password + '）' : (!item.isUrl) && <View className='see'>（查看<Image src={require('../../assets/img/video.png')} mode='widthFix' className='video'></Image>）
                                </View>
                            }
                        </View>
                    })
                }
                <View className='adver'>
                    <ad unit-id="adunit-d9d4a7929afd768d"></ad>
                </View>
            </View>
        )
    }
}
