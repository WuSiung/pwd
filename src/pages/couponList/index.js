import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Swiper, SwiperItem } from '@tarojs/components'
import { AtNoticebar } from 'taro-ui'
import cls from 'classnames'
import { gameList } from '@/game'
import './index.less'

const prefixCls = 'coupon-list'
export default class Coupon extends Component {

    config = {
        navigationBarTitleText: '活动列表'
    }

    constructor(props) {
        super(props)
        this.state = {
            couponList: [],
            notice: []
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        Taro.cloud.init()
        const db = Taro.cloud.database()
        db.collection('couponList').get().then(res => {
            // res.data 包含该记录的数据
            this.setState({
                couponList: res.data.filter(item => {
                    return item.status == 1
                })
            })
        })
        db.collection('notice').get().then(res => {
            // res.data 包含该记录的数据
            this.setState({
                notice: res.data.filter(item => {
                    return item.isShow
                })
            })
        })
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    toCouponDetail(item) {
        Taro.navigateTo({
            url: '/pages/coupon/index?id=' + item._id
        })
    }

    toNoticeDetail(item){
        Taro.navigateTo({
            url: '/pages/notice/index?id=' + item._id
        })
    }

    render() {
        const { couponList } = this.state
        return (
            <View className={cls(prefixCls)}>
                <Swiper className='notice' autoplay>
                    {
                        notice.map(item => {
                            return <SwiperItem marquee onClick={this.toNoticeDetail.bind(this,item)}>
                                <View className='title'>{item.title}</View>
                            </SwiperItem>
                        })
                    }
                </Swiper>
                {
                    couponList.map(item => {
                        return <View className={cls(`${prefixCls}-list`)} onClick={this.toCouponDetail.bind(this, item)}>{item.title}</View>
                    })
                }
                <View className='adver'>
                    <ad unit-id="adunit-d9d4a7929afd768d"></ad>
                </View>
            </View>
        )
    }
}
