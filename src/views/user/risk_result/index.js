
//个人信息=>风险测评=>风险测评结果
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, Button } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'
import { Tap } from 'COMPONENT'

const Item = List.Item

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "风险测评结果";
        super(props, context)
        this.state = {
            param:{
                grade1: true,//1
                grade2: false,//1
                grade3: false,//1
                grade4: false,//1
                grade5: false,//1
                desc:'',//文字内容

                createTime: '',//创建时间
                score: 0,//测评得分
                scoreStyle: 0,//类型名
            }
            
        };
    }
    componentDidMount(){
        this.Fun()
    }



    Fun=()=>{
        let { param } = this.state
        let num = param.score
        // 获取用户风险信息
        $.ajaxE({
            type: 'GET',
            url: "/user/my/getRisk",
            data: {},
        }).then((data) => {
            param.score = data.score
            param.createTime  = data.createTime 

            let num = data.score
            
            if (num <= 22) {
                param.scoreStyle = '保守型1';
                param.desc = '您的风险承担能力水平比较低，您关注资产的安全性远超于资产的收益性，所以低风险、高流动性的投资品种比较适合您，这类投资的收益相对偏低。';
                param.grade1 = true;
                param.grade2 = false;
                param.grade3 = false;
                param.grade4 = false;
                param.grade5 = false;
            } else if (num > 22 && num <= 44) {
                param.scoreStyle = '稳健型';
                param.desc = '您有比较有限的风险承受能力，对投资收益比较敏感，期望通过短期、持续、渐进的投资获得高于定期存款的回报。所以较低等级风险的产品如保本保息的固定收益类，⽐比较适合您，适当回避⻛风险的同时保证收益，跑赢通胀。';
                param.grade1 = true;
                param.grade2 = true;
                param.grade3 = false;
                param.grade4 = false;
                param.grade5 = false;
            } else if (num > 44 && num <= 66) {
                param.scoreStyle = '平衡性';
                param.desc = '您有一定的风险承受能力，对投资收益比较敏敏感，期望通过长期且持续的投资获得高于平均水平的回报，通常更更注重十年甚至更长期限内的平均收益。所以中等风险收益的投资品种比较适合您，回避风险的同时有一定的收益保证。';
                param.grade1 = true;
                param.grade2 = true;
                param.grade3 = true;
                param.grade4 = false;
                param.grade5 = false;
            } else if (num > 66 && num <= 88) {
                param.scoreStyle = '积极性';
                param.desc = '您有中高的风险承受能力，愿意承担可预见的投资风险去获取更更多的收益，一般倾向于进行中短期投资。所以中高等级的风险收益投资品种比较适合您，以一定的可预见风险换取超额收益。';
                param.grade1 = true;
                param.grade2 = true;
                param.grade3 = true;
                param.grade4 = true;
                param.grade5 = false;
            } else if (num > 88) {
                param.scoreStyle = '激进性';
                param.desc = '您有较高的风险承受能力，是富有冒险精神的积极型选手。在投资收益波动的情况下，仍然保持积极进取的投资理念。短期内投资收益的下跌被您视为加注投资的利好机会。您适合从事灵活、风险与报酬都比较高的投资，不过要注意不要因一时的高报酬获利而将全部资金投入高风险操作，务必做好风险管理与资金调配工作。';
                param.grade1 = true;
                param.grade2 = true;
                param.grade3 = true;
                param.grade4 = true;
                param.grade5 = true;
            }
      
            this.setState({
                param
            })
            

        }).catch((msg) => {
            Modal.alertX('提醒',msg);
        })
        
        
    }
    goRisk=()=>{
        
        let {param} = this.state
        let time1 = new Date().Format('yyyy-MM-dd');
        let time2 = new Date(param.createTime ).Format('yyyy-MM-dd');
        if (time1 == time2) {
            Modal.alertX('提醒', '您今天已经测评过了，请明天再试', [{ text: '知道了', onPress: () => {} }]);
        } else {
            // 跳转页面
            this.props.history.push({
                pathname: '/user/risk'
            });
        }
        
    }

    render() {
        let { param } = this.state;
        return (
            <div className='view-risk-result'>
                <div className="riskre_div">
                    <div className="reskre_top">
                        <p className="sml">您的投资风格</p>
                        <p className="big">{param.scoreStyle}</p>
                        <div className="star">
                            <ul>
                                <li className={param.grade1 ? 'active' : ''}>
                                    <img className="img1" src={'/imgs/com/jjd_star.svg'} />
                                    <img className="img2" src={'/imgs/com/jjd_star_act.svg'} />
                                </li>
                                <li className={param.grade2 ? 'active' : ''}>
                                    <img className="img1" src={'/imgs/com/jjd_star.svg'} />
                                    <img className="img2" src={'/imgs/com/jjd_star_act.svg'} />
                                </li>
                                <li className={param.grade3 ? 'active' : ''}>
                                     <img className="img1" src={'/imgs/com/jjd_star.svg'} />
                                    <img className="img2" src={'/imgs/com/jjd_star_act.svg'} />
                                </li>
                                <li className={param.grade4 ? 'active' : ''}>
                                     <img className="img1" src={'/imgs/com/jjd_star.svg'} />
                                    <img className="img2" src={'/imgs/com/jjd_star_act.svg'} />
                                </li>
                                <li className={param.grade5 ? 'active' : ''}>
                                     <img className="img1" src={'/imgs/com/jjd_star.svg'} />
                                    <img className="img2" src={'/imgs/com/jjd_star_act.svg'} />
                                </li>
                            </ul>
                        </div>
                        <p className="tt">注:星号仅代表您的风险承受等级</p>
                    </div>
                    
                    <p className="res_p">{param.desc}</p>
                </div>


                {/* 跳转到测评 */}
                <List className="bottom-btn">
                    <Tap onTap={() => { this.goRisk() }}>
                        <Button type="primary">重新测评</Button>
                    </Tap>
                </List> 


            </div>
        )
    }
}
