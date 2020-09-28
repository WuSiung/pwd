import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import cls from 'classnames'
import { gameList } from '@/game'
import './index.less'

// 在页面中定义激励视频广告
let videoAd = null
const prefixCls = 'coupon'
export default class Coupon extends Component {

    config = {
        navigationBarTitleText: '抽奖'
    }

    constructor(props) {
        super(props)
        this.state = {
            showInput: false,
            phone: '',
            qq: '',
            couponDetail: {}
        }
    }

    componentWillMount = async () => {
        Taro.showLoading()
        const { id } = this.$router.params

        Taro.cloud.init()
        const db = Taro.cloud.database()
        db.collection('couponList').where({ '_id': id }).get().then(res => {
            Taro.hideLoading()
            this.setState({
                couponDetail: res.data[0]
            })
        })
        const count = await db.collection('coupons').where({ 'type': id }).count()
        this.setState({
            count: count.total
        })
    }

    componentDidMount() {
        let _this = this
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
                        showInput: true
                    })
                }
            })
        }
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    copyWebUrl() {
        Taro.setClipboardData({
            data: 'https://azz.net/veronica',
            success: res => {
                console.log(res)
            }
        })
    }

    showInputBtn() {
        // 用户触发广告后，显示激励视频广告
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
        } else {
            this.setState({
                showInput: true
            })
        }
    }

    submitNumber() {
        const db = Taro.cloud.database()
        const coupons = db.collection('coupons')
        const status = this.regNumber() // 验证填写的number
        const { phone, qq } = this.state
        let { count } = this.state
        const now = new Date()
        const date = now.getMonth() + 1 + '-' + now.getDate()
        const { id } = this.$router.params
        if (!status) return
        coupons.add({
            data: {
                phone: phone,
                qq: qq,
                date: date,
                type: id
            },
            success: () => {
                count++
                this.setState({
                    showInput: false,
                    count
                })
                Taro.showToast({
                    title: '报名成功'
                })
            },
            fail: (err) => {
                console.log(err)
            }
        })
    }

    regNumber() {
        const { phone, qq } = this.state
        const phoneReg = /^1[3-9]\d{9}$/
        const qqReg = /^[1-9][0-9]{4,}$/;
        if (phone == '' && qq == '') {
            Taro.showToast({
                title: '请选填一个',
                icon: 'none'
            })
            return false
        } else {
            if (phone && !phoneReg.test(phone)) {
                Taro.showToast({
                    title: '请输入正确的手机号码',
                    icon: 'none'
                })
                return false
            }
            else if (qq && !qqReg.test(qq)) {
                Taro.showToast({
                    title: '请输入正确的qq号码',
                    icon: 'none'
                })
                return false
            }
            return true
        }
    }

    inputNumber(type, e) {
        this.setState({
            [type]: e.detail.value
        })

    }
    cancel() {
        this.setState({
            showInput: false
        })
    }

    render() {
        const { showInput, couponDetail, count } = this.state
        return (
            <View className={cls(prefixCls)}>
                <View className='title'> {couponDetail.content} </View>
                <View className='time'>
                    本次活动时间：{couponDetail.startTime}至{couponDetail.endTime}
                </View>
                <View className='btn' onClick={this.showInputBtn.bind(this)}>
                    报名参与抽奖
                </View>
                <View className='tips'>当前参与人数：{count}</View>
                <View className='tips'>
                    本次活动抽奖结束后，Veronica技术组将会以人工的方式联系您，所以请务必留下正确的联系方式
                </View>
                {
                    showInput && <View className='input-form'>
                        <View className='box'>
                            <View className='input'>
                                <Text>手机号：</Text><Input placeholder='请输入手机号' onInput={this.inputNumber.bind(this, 'phone')}></Input>
                            </View>
                            <View className='input'>
                                <Text>qq号：</Text><Input placeholder='请输入qq号' onInput={this.inputNumber.bind(this, 'qq')}></Input>
                            </View>
                            <View className='tips'>*手机号或者qq号任填其一即可</View>
                            <View className='btns'>
                                <View className='submit cancel' onClick={this.cancel.bind(this)}>取消</View>
                                <View className='submit' onClick={this.submitNumber.bind(this)}>提交</View>
                            </View>
                        </View>
                    </View>
                }
                <View className='adver'>
                    <ad unit-id="adunit-d9d4a7929afd768d"></ad>
                </View>
            </View>
        )
    }
}
