
//个人信息=>风险测评
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, Button } from 'antd-mobile'
import { Tap } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'

const Item = List.Item

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "风险测评";
        super(props, context)
        this.state = {
            modal1:false,//弹窗
            value1: '',
            value2: '',
            value3: '',
            value4: '',
            value5: '',
            value6: '',
            value7: '',
            value8: '',
            value9: '',
            value10: '',
        };
    }

    // 显示弹窗函数
    showPop=()=>{
        Modal.alertX('提醒', <div><p style={{textAlign:'left'}}>1.为了便于您了解自身的风险承受能力，请您填写以下风险承受力调查问题。本问卷的准确性依据您所填写的答案而定，请您根据自身情况认真选择。</p>
        <p style={{textAlign:'left'}}>2.评估结果仅供参考，不构成投资建议。为了及时了解您的风险承受能力，我们建议您持续做好动态评估。</p>
    </div>, [
            {
                text: '知道了', onPress: () => {

                }
            }
        ]);
    }
    // 关闭弹窗
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }

    radio1 = (e)=>{
        this.setState({
            value1: e.target.value
        })
        
    }
    radio2 = (e)=>{
        this.setState({
            value2: e.target.value
        })
        
    }
    radio3 = (e) => {
        this.setState({
            value3: e.target.value
        })
        
    }
    radio4 = (e) => {
        this.setState({
            value4: e.target.value
        })
        
    }
    radio5 = (e) => {
        this.setState({
            value5: e.target.value
        })
        
    }
    radio6 = (e) => {
        this.setState({
            value6: e.target.value
        })
        
    }
    radio7 = (e) => {
        this.setState({
            value7: e.target.value
        })
        
    }
    radio8 = (e) => {
        this.setState({
            value8: e.target.value
        })
        
    }
    radio9 = (e) => {
        this.setState({
            value9: e.target.value
        })
        
    }
    radio10 = (e) => {
        this.setState({
            value10: e.target.value
        })
        
    }
    // 提交按钮
    addRsik = () => {
        let { value1, value2, value3, value4, value5, value6, value7, value8, value9, value10 } = this.state
        
        if(value1==''){
            Modal.alertX('提醒', '您的第一题没有选择，请选择', [{
                text: '知道了', onPress: () => {}
            }]);
        } else if (value2 == ''){
            Modal.alertX('提醒', '您的第二题没有选择，请选择', [{
                text: '知道了', onPress: () => {}
            }]);
        } else if (value3 == '') {
            Modal.alertX('提醒', '您的第三题没有选择，请选择', [{
                text: '知道了', onPress: () => {}
            }]);
        } else if (value4 == '') {
            Modal.alertX('提醒', '您的第四题没有选择，请选择', [{
                text: '知道了', onPress: () => {}
            }]);
        } else if (value5 == '') {
            Modal.alertX('提醒', '您的第五题没有选择，请选择', [{
                text: '知道了', onPress: () => {}
            }]);
        } else if (value6 == '') {
            Modal.alertX('提醒', '您的第六题没有选择，请选择', [{
                text: '知道了', onPress: () => {}
            }]);
        } else if (value7 == '') {
            Modal.alertX('提醒', '您的第七题没有选择，请选择', [{
                text: '知道了', onPress: () => {}
            }]);
        } else if (value8 == '') {
            Modal.alertX('提醒', '您的第八题没有选择，请选择', [{
                text: '知道了', onPress: () => {}
            }]);
        } else if (value9 == '') {
            Modal.alertX('提醒', '您的第九题没有选择，请选择', [{
                text: '知道了', onPress: () => {}
            }]);
        } else if (value10 == '') {
            Modal.alertX('提醒', '您的第十题没有选择，请选择', [{
                text: '知道了', onPress: () => {}
            }]);
        } else {
            let score = parseInt(value1) + parseInt(value2) + parseInt(value3) + parseInt(value4) + parseInt(value5) + parseInt(value6) + parseInt(value7) + parseInt(value8) + parseInt(value9) + parseInt(value10)
            
            // 提交风险测评分数到数据库
            $.ajaxE({
                type: 'POST',
                url: "/user/my/addRisk",
                contentType: 'application/json',
                data: {
                    score: score
                }
            }).then((data) => {
                // 跳转页面
                this.props.history.push({
                    pathname: '/user/risk_result'
                });
            }).catch((msg) => {
                console.log(msg);
            }) 
        }   
    }

    render() {
        return (
            <div className='view-risk'>
                <List className="ri-tip">
                    <Item>
                        测一测你的投资风格（预计约2分钟）
                    </Item>
                    <Tap onTap={() => { this.showPop() }}>
                        <div className="tips-Item">
                            注意事项？
                        </div>
                    </Tap>
                </List>
                <div className="iou-part-select">
                    <div className="i-title">1. 您的年龄在以下哪个范围内?</div>
                    <form >
                        <div className="mui-input-row mui-radio mui-left">
                            <label >A. 29岁以下
                                <input className="myCheck" name="radio1" type="radio" value='10' onChange={this.radio1} />
                                <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>B. 30-39岁<input id="myCheck" className="myCheck" name="radio1" type="radio" value='8' onChange={this.radio1}/>
                                <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>C. 40-49岁<input name="radio1" className="myCheck" type="radio" value='5' onChange={this.radio1} />
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>D. 50-59岁<input name="radio1" className="myCheck" type="radio" value='3'  onChange={this.radio1}/>
                                <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>E. 60岁以上<input name="radio1" className="myCheck" type="radio" value='0'  onChange={this.radio1}/>
                                <span for="myCheck"></span>
                            </label>
                        </div>
                    </form>
                </div>

                <div className="iou-part-select">
                    <div className="i-title">2.您有过几年的投资经验?</div>
                    <form >
                        <div className="mui-input-row mui-radio mui-left">
                            <label >A. 10年以上<input className="myCheck" name="radio1" type="radio" value='10' onChange={this.radio2}/>
                                <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>B. 6-10年<input className="myCheck" name="radio1" type="radio" value='8' onChange={this.radio2}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>C. 3-5年<input className="myCheck" name="radio1" type="radio" value='5' onChange={this.radio2}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>D. 1-2年<input className="myCheck" name="radio1" type="radio" value='3' onChange={this.radio2}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>E. 1年以下<input className="myCheck" name="radio1" type="radio" value='0' onChange={this.radio2}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                    </form>
                </div>

                <div className="iou-part-select">
                    <div className="i-title">3.您是否有过投资经验？</div>
                    <form >
                        <div className="mui-input-row mui-radio mui-left">
                            <label >A. 有投资贵金属、外汇、期货、期权等高风险衍⽣品经验<input className="myCheck" name="radio1" type="radio" value='10' onChange={this.radio3}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>B. 有投资股票、股票型基⾦的经验<input className="myCheck" name="radio1" type="radio" value='8' onChange={this.radio3}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>C. 有购买过银行的理财产品、债券基金、分红型、投连险<input className="myCheck" name="radio1" type="radio" value='5' onChange={this.radio3}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>D. 有购买过保本基金、货币基金（如余额宝）、信托等低风险产品<input className="myCheck" name="radio1" type="radio" value='3' onChange={this.radio3}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>E. 从未有过投资经历，只存银行的定期或活期<input className="myCheck" name="radio1" type="radio" value='0' onChange={this.radio3}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                    </form>
                </div>
                <div className="iou-part-select">
                    <div className="i-title">4.您的家庭⽬前全年收入状况如何？</div>
                    <form >
                        <div className="mui-input-row mui-radio mui-left">
                            <label >A. 50万元以上<input className="myCheck" name="radio1" type="radio" value='10' onChange={this.radio4}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>B. 30-50万元<input className="myCheck" name="radio1" type="radio" value='8' onChange={this.radio4}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>C. 15-30万元<input className="myCheck" name="radio1" type="radio" value='5' onChange={this.radio4}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>D. 5-15万元<input className="myCheck" name="radio1" type="radio" value='3' onChange={this.radio4}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>E. 5万以下<input className="myCheck" name="radio1" type="radio" value='0' onChange={this.radio4}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                    </form>
                </div>
                <div className="iou-part-select">
                    <div className="i-title">5.您投资的主要⽬的是什么？选择最符合您的⼀个描述：</div>
                    <form >
                        <div className="mui-input-row mui-radio mui-left">
                            <label >A. 倾向⻓期的成长，较少关⼼短期的回报以及波动<input className="myCheck" name="radio1" type="radio" value='10' onChange={this.radio5}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>B. 倾向⻓期的成长，较少关⼼短期的回报以及波动<input className="myCheck" name="radio1" type="radio" value='8' onChange={this.radio5}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>C. 希望投资能获得一定的增值，同时获得波动适度的年回报<input className="myCheck" name="radio1" type="radio" value='5' onChange={this.radio5}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>D. 只想确保资产的安全性，同时希望能够得到固定的收益<input className="myCheck" name="radio1" type="radio" value='3' onChange={this.radio5}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>E. 希望利用投资以及投资所获得的收益在短期内⽤于⼤额的购买计划。<input className="myCheck" name="radio1" type="radio" value='0' onChange={this.radio5}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                    </form>
                    
                </div>
                <div className="iou-part-select">
                    <div className="i-title">6.当您进⾏投资时（例例如基金、股票），您能接受⼀年内损失多少？</div>
                    <form >
                        <div className="mui-input-row mui-radio mui-left">
                            <label >A. 我能承受25％以上亏损<input className="myCheck" name="radio1" type="radio" value='10' onChange={this.radio6}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>B. 我能承受10-20％的亏损<input className="myCheck" name="radio1" type="radio" value='8' onChange={this.radio6}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>C. 我最多只能承受5-10%的亏损<input className="myCheck" name="radio1" type="radio" value='5' onChange={this.radio6}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>D. 我最多只能承受5%以下的亏损<input className="myCheck" name="radio1" type="radio" value='3' onChange={this.radio6}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>E. 我几乎不能承受任何亏损<input className="myCheck" name="radio1" type="radio" value='0' onChange={this.radio6}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                    </form>
                    
                </div>
                <div className="iou-part-select">
                    <div className="i-title">7.目前您的投资主要是哪一品种？</div>
                    <form >
                        <div className="mui-input-row mui-radio mui-left">
                            <label >A. 外汇、期货、现货贵金属等超高风险资产<input className="myCheck" name="radio1" type="radio" value='10' onChange={this.radio7}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>B. 股票、股票基金、私募股权基金等⾼风险资产<input className="myCheck" name="radio1" type="radio" value='8' onChange={this.radio7}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>C. 混合基金、指数基⾦、结构类产品等较⾼风险资产<input className="myCheck" name="radio1" type="radio" value='5' onChange={this.radio7}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>D. 银⾏理财产品、信托、固定收益类基⾦（有限合伙基金）、货币基金(如余额宝）<input className="myCheck" name="radio1" type="radio" value='3' onChange={this.radio7}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>E. 活期、定期存款、国债、保险<input className="myCheck" name="radio1" type="radio" value='0' onChange={this.radio7}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                    </form>
                   
                </div>
                <div className="iou-part-select">
                    <div className="i-title">8.如果您拥有50万用来建⽴资产组合，您会选择下⾯哪⼀个组合？</div>
                    <form >
                        <div className="mui-input-row mui-radio mui-left">
                            <label >A. 低⻛险投资、一般风险投资、高风险投资的比重分别为 5 ：15 ：80<input className="myCheck" name="radio1" type="radio" value='10' onChange={this.radio8}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>B. 低⻛险投资、⼀般风险投资、高风险投资的⽐重分别为 10 ：30 ：60<input className="myCheck" name="radio1" type="radio" value='8' onChange={this.radio8}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>C. 低⻛险投资、⼀般风险投资、高风险投资的⽐重分别为 30 ：40 ：30<input className="myCheck" name="radio1" type="radio" value='5' onChange={this.radio8}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>D. 低⻛险投资、一般⻛险投资、高风险投资的比重分别为 60 ：30 ：10<input className="myCheck" name="radio1" type="radio" value='3' onChange={this.radio8}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>E. 低⻛险投资、⼀般风险投资、高风险投资的比重分别为 80 ：15 ：5<input className="myCheck" name="radio1" type="radio" value='0' onChange={this.radio8}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                    </form>
                    
                </div>
                <div className="iou-part-select">
                    <div className="i-title">9.⻓期⻛险承受水平：下面哪⼀种描述最符合您可接受的价值波动程度？</div>
                    <form >
                        <div className="mui-input-row mui-radio mui-left">
                            <label >A. 希望赚取最高回报潜力，能接受3年以上的负面波动，包括损失本金<input className="myCheck" name="radio1" type="radio" value='10' onChange={this.radio9}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>B. 希望赚取较高回报潜力，能接受3年以上的负⾯面波动<input className="myCheck" name="radio1" type="radio" value='8' onChange={this.radio9}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>C. 寻求资金较⾼收益，可接受3年内负⾯波动，使回报显著高于定期存款<input className="myCheck" name="radio1" type="radio" value='5' onChange={this.radio9}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>D. 保守投资，但愿意在2年内接受少许负⾯波动，使回报高于定期存款<input className="myCheck" name="radio1" type="radio" value='3' onChange={this.radio9}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>E. 不希望投资本金承担⻛险。我愿意接受的回报大约与定期存款⼀样<input className="myCheck" name="radio1" type="radio" value='0' onChange={this.radio9}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                    </form>
                    
                </div>
                <div className="iou-part-select">
                    <div className="i-title">10.假设现有以下几个投资品种，那您会选择哪⼀个？</div>
                    <form >
                        <div className="mui-input-row mui-radio mui-left">
                            <label >A. 收益率在30%以上，同时本金也有可能亏损20%以上<input className="myCheck" name="radio1" type="radio" value='10' onChange={this.radio10}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>B. 本⾦不保证，收益率在20%以内，同时本金也有可能亏损10%以内<input className="myCheck" name="radio1" type="radio" value='8' onChange={this.radio10}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>C. 本息保证，收益率在10%左右<input className="myCheck" name="radio1" type="radio" value='5' onChange={this.radio10}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>D. 本息保证，收益率在4-6%之间<input className="myCheck" name="radio1" type="radio" value='3' onChange={this.radio10}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                        <div className="mui-input-row mui-radio mui-left">
                            <label>银⾏定期存款，收益率在3%<input className="myCheck" name="radio1" type="radio" value='0' onChange={this.radio10}/>
                            <span for="myCheck"></span>
                            </label>
                        </div>
                    </form>
                    
                </div>

                {/* 跳转到测评结果 */}
                <List className="bottom-btn">
                    <Tap onTap={() => { this.addRsik() }}>
                        <Button type="primary">确认提交</Button>
                    </Tap>  
                </List> 
            </div>
        )
    }
}
