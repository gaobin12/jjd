
//借条生成成功
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Flex, Button } from 'antd-mobile'

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "极速借条";
        super(props, context)
        this.state = {
        };
    }

    render() {
        return (
            <div className='view-fast-credit'>
                <div className="img">
                    <img src={'/imgs/com/pay-succ.png'} />
                </div>
                <div className="f-success">借条已生成</div>
                {/* 按钮 */}
                <Flex>
                    <Flex.Item>
                        <Link to='/'>
                            <Button className="">回首页</Button>
                        </Link>
                    </Flex.Item>
                    <Flex.Item>
                        <Link to='/iou/borrow_detail'>
                            <Button className="active">查看借条详情</Button>
                        </Link>
                    </Flex.Item>
                </Flex>
            </div>
        )
    }
}


