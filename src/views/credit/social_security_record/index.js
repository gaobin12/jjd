
//信用报告-消费详情
import '../credit.less'
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { List, Flex } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { Loading, Modal, util } from 'SERVICE'

@withRouter
@inject('creditStore', 'userStore')
@observer
export default class App extends Component {
    constructor(props, context) {
        document.title = "社保缴费详情";
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
        this.state = {
            userId: query.userId,
            list: [],
            endowment_insurance: '',
            medical_insurance: '',
            unemployment_insurance: '',
            accident_insurance: '',
            maternity_insurance: '',
            tap: 0,
        };
    }
    // 日期格式转换
    formatDate = (time) => {
        return new Date(time * 1000).Format('yyyy-MM-dd');
    }
    componentDidMount() {
        this.getRecordInfo();
    }
    getRecordInfo = () => {
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/credit/user/getSheBaoDetail',
            data: {
                userId: this.state.userId
            }
        }).then((data) => {
            //保存用户数据
            this.setState({
                endowment_insurance: data.task_data.endowment_insurance,
                medical_insurance: data.task_data.medical_insurance,
                unemployment_insurance: data.task_data.unemployment_insurance,
                accident_insurance: data.task_data.accident_insurance,
                maternity_insurance: data.task_data.maternity_insurance
            })
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(() => {
            Loading.hide();
        })
    }
    //标签切换
    onTap = (v) => {
        this.setState({
            tap: v
        })
    }

    render() {
        let { endowment_insurance, medical_insurance, unemployment_insurance, accident_insurance, maternity_insurance, tap } = this.state;
        return (
            <div className='record-credit'>
            <Flex className="sbTitle">
                <Flex.Item onClick={() => { this.onTap(0) }} className={tap == 0 ? 'active' : ''}>养老</Flex.Item>
                <Flex.Item onClick={() => { this.onTap(1) }} className={tap == 1 ? 'active' : ''}>医疗</Flex.Item>
                <Flex.Item onClick={() => { this.onTap(2) }} className={tap == 2 ? 'active' : ''}>失业</Flex.Item>
                <Flex.Item onClick={() => { this.onTap(3) }} className={tap == 3 ? 'active' : ''}>工伤</Flex.Item>
                <Flex.Item onClick={() => { this.onTap(4) }} className={tap == 4 ? 'active' : ''}>生育</Flex.Item>
            </Flex>
                <Flex className="father_flex_tit">
                    <Flex.Item>缴纳时间</Flex.Item>
                    <Flex.Item>缴纳基数</Flex.Item>
                    <Flex.Item>单位缴存</Flex.Item>
                    <Flex.Item>个人缴存</Flex.Item>
                    <Flex.Item>缴费状态</Flex.Item>
                </Flex>
                {tap==0?<div className="father_flex_div">
                    {endowment_insurance && endowment_insurance.map((item) => {
                        return (
                            <Flex className="father_flex" key={Math.random()}>
                                <Flex.Item className="fontC4">{item.month}</Flex.Item>
                                <Flex.Item>{item.base_number}</Flex.Item>
                                <Flex.Item>{item.monthly_company_income}</Flex.Item>
                                <Flex.Item>{item.monthly_personal_income}</Flex.Item>
                                <Flex.Item>{item.type}</Flex.Item>
                            </Flex>
                        )
                    })}
                </div>:null}
                {tap == 1 ? <div className="father_flex_div">
                    {medical_insurance && medical_insurance.map((item) => {
                        return (
                            <Flex className="father_flex" key={Math.random()}>
                                <Flex.Item className="fontC4">{item.month}</Flex.Item>
                                <Flex.Item>{item.base_number}</Flex.Item>
                                <Flex.Item>{item.monthly_company_income}</Flex.Item>
                                <Flex.Item>{item.monthly_personal_income}</Flex.Item>
                                <Flex.Item>{item.type}</Flex.Item>
                            </Flex>
                        )
                    })}
                </div> : null}
                {tap == 2 ? <div className="father_flex_div">
                    {unemployment_insurance && unemployment_insurance.map((item) => {
                        return (
                            <Flex className="father_flex" key={Math.random()}>
                                <Flex.Item className="fontC4">{item.month}</Flex.Item>
                                <Flex.Item>{item.base_number}</Flex.Item>
                                <Flex.Item>{item.monthly_company_income}</Flex.Item>
                                <Flex.Item>{item.monthly_personal_income}</Flex.Item>
                                <Flex.Item>{item.type}</Flex.Item>
                            </Flex>
                        )
                    })}
                </div> : null}
                {tap == 3 ? <div className="father_flex_div">
                    {accident_insurance && accident_insurance.map((item) => {
                        return (
                            <Flex className="father_flex" key={Math.random()}>
                                <Flex.Item className="fontC4">{item.month}</Flex.Item>
                                <Flex.Item>{item.base_number}</Flex.Item>
                                <Flex.Item>{item.monthly_company_income}</Flex.Item>
                                <Flex.Item>{item.monthly_personal_income}</Flex.Item>
                                <Flex.Item>{item.type}</Flex.Item>
                            </Flex>
                        )
                    })}
                </div> : null}
                {tap == 4 ? <div className="father_flex_div">
                    {maternity_insurance && maternity_insurance.map((item) => {
                        return (
                            <Flex className="father_flex" key={Math.random()}>
                                <Flex.Item className="fontC4">{item.month}</Flex.Item>
                                <Flex.Item>{item.base_number}</Flex.Item>
                                <Flex.Item>{item.monthly_company_income}</Flex.Item>
                                <Flex.Item>{item.monthly_personal_income}</Flex.Item>
                                <Flex.Item>{item.type}</Flex.Item>
                            </Flex>
                        )
                    })}
                </div> : null}
                <List className="no_data" style={(this.state.endowment_insurance == 0 && this.state.medical_insurance == 0 && this.state.unemployment_insurance == 0 && this.state.accident_insurance == 0 && this.state.maternity_insurance == 0) ? null : { display: 'none' }}>
                    <img src={'/imgs/iou/loan-null.svg'} />
                    <div className="row_font">暂无任何内容</div>
                </List>

            </div>
        )
    }
}
