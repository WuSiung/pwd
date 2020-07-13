import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import cls from 'classnames'
import { gameList } from '@/game'
import './index.less'

const prefixCls = 'coupon'
export default class Coupon extends Component {

    config = {
        navigationBarTitleText: '抽奖'
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

    copyWebUrl() {
        Taro.setClipboardData({
            data: 'https://azz.net/veronica',
            success: res => {
                console.log(res)
            }
        })
    }

    render() {
        return (
            <View className={cls(prefixCls)} onClick={this.copyWebUrl.bind(this)}>
                <View className='title'>
                    本次活动奖品：即获得游戏最新版本以及所有礼包和密码（包括赞助奖励），以及管理解答的特权一个月。
                </View>
                <View className='time'>
                    抽奖开始时间：xxxx年xx月xx日xx时
                </View>
                <View className='time'>
                    抽奖结束时间：xxxx年xx月xx日xx时
                </View>
                <View className='btn'>
                    报名参与抽奖
                </View>
                <View className='tips'>
                    本次活动抽奖结束后，Veronica技术组将会以人工的方式联系您，所以请务必留下正确的联系方式
                </View>
            </View>
        )
    }
}
