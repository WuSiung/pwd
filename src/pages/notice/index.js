import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import cls from 'classnames'

const prefixCls = 'notice'
export default class Notice extends Component {
    config = {
        navigationBarTitleText: '公告'
    }

    constructor(props) {
        super(props)
        this.state = {
            noticeDetail: {}
        }
    }

    componentWillMount() { }

    componentDidMount() {
        Taro.cloud.init()
        const db = Taro.cloud.database()
        const { id } = this.$router.params
        db.collection('notice').where({ '_id': id }).get().then(res => {
            // res.data 包含该记录的数据
            this.setState({
                noticeDetail: res.data[0]
            })
        })
    }

    render() {
        const { noticeDetail } = this.state
        return (
            <View className={cls(prefixCls)}>
                <View className='title'>{noticeDetail.title}</View>
                {
                    noticeDetail.content.map(item => {
                        return <View className='content'>{item}</View>
                    })
                }
            </View>
        )
    }
}