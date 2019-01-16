
//借款协议
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Modal } from 'SERVICE'
import Tap from 'COMPONENT/Tap'
import { Toast } from 'antd-mobile'


@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "借款协议";
        super(props, context)
        this.state = {
            id: '',//借条ID
            userInfo:{
                borrowerName: '', // 借款人姓名
                borrowerUidE: '', //借款人id（加密后）
                borrowerTelephone: '', // 借款人手机号
                borrowerIdCardNo: '', // 借款人身份证号
                lenderName: '', // 出借人姓名
                lenderUidE: '', //出借人id（加密后）
                lenderTelephone: '', // 出借人手机号
                lenderIdCardNo: '', // 出借人身份证号
                guaranteeName: '', // 担保人姓名
                guaranteeUidE: '',	// 担保人id（加密后）
                guaranteeTelephone: '', // 担保人手机号
                guaranteeIdCardNo: '', // 担保人身份证号
                amount: '', // 借款本金
                serviceAmount: '',	// 服务费用
                guaranteeAmount: '', // 担保费用
                interestAmount: '',	// 应还利息
                forfeitAmount: '',	// 滞纳金
                overdueManageAmount: '',	// 逾期管理费
                totalAmount: '',	// 应还总额
                borrowTime: '', // 借款时间 （时间戳格式0)
                repayTime: '', // 预期还款时间（时间戳格式）
                interestRate: '', // 年利率
                purposeType: '', // 借款目的
                create_time: '', // 创建时间
                repayType: '',	// 还款方式0.到期还本付息1.等额本息
                onlineStatus: true,	// 生成借条的时候是否线上false.否true.是
                selfType: '', // 查看者的身份0.其他用户 1.借款人2.出借人3.担保人
                reportCount: 0, // 借条被举报次数
                status: 1,
                versionNumber:10,
                period:'', //还款期数
            },
            repayList:[{}],
            modal1:false,//弹窗模板
            urlContent:'',//弹窗显示的内容
            isShow:'none',//是否显示下载按钮
        };
    }

    componentDidMount() {
        let query = this.props.location.query;
        if(query && query.id){
            this.getLoanAgreements();
            this.setState({
                id:query.id
            })
        }else{
            this.setState({
                isShow:'none', 
            })
        }
    }
    // 获取信息
    getLoanAgreements=()=>{
        const _this = this;
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/loaninfo/getLoan',
            data: {
                loanId: _this.state.id
            }
        }).then((data) => {
            data.borrowTime = (new Date(data.borrowTime * 1000)).Format('yyyy-MM-dd');
            data.repayTime = (new Date(data.repayTime * 1000)).Format('yyyy-MM-dd');
            data.createTime = (new Date(data.createTime)).Format('yyyy-MM-dd hh:mm:ss');
            
            data.repayTypeTxt = $.repayType(data.repayType);
            // 应还总额
            data.totalAmount = $.toYuan(data.totalAmount);	
            data.purposeType = $.purpose(data.purposeType);
            if(data.repayType==1){
                this.getPayInfo();
            }
            
            _this.setState({
                userInfo: data,
                isShow: 'block',
            });
        }).catch((msg,res) => {
            if(res.status == 202){
                Modal.infoX(msg,()=>{
                    _this.props.history.push({
                        pathname: '/'
                    });
                });
            }else{
                Modal.infoX(msg);
            }
        })        

    }
    // 查看借条相关还款列表
    getPayInfo=()=>{
        const _this = this;
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/loaninfo/getPayInfoList',
            data: {
                loanId: _this.state.id
            }
        }).then((data) => {
            _this.setState({
                repayList: data.repayList,
            });
        }).catch((msg,res) => {
            Modal.infoX(msg);
        })        

    }
    // 对身份证号脱敏处理
    getHideIdCard=(idCard) =>{
        if (idCard.length==null){
            return null
       }
        if (idCard.length == 18) {
            return idCard.substring(0, 6) + "**********" + idCard.substring(16)
        }
        if (idCard.length == 15) {
            return idCard.substring(0, 6) + "******" + idCard.substring(12)
        }
        return null;
    }   

    // 获取数字的中文显示
	digitUppercase=(num) =>{
		var fraction = ['角', '分']
		var digit = [
			'零', '壹', '贰', '叁', '肆',
			'伍', '陆', '柒', '捌', '玖'
		]
		var unit = [
			['元', '万', '亿'],
			['', '拾', '佰', '仟']
		]
		var s = ''
		for (var i = 0; i < fraction.length; i += 1) {
			s += (digit[Math.floor(num * 10 * Math.pow(10, i)) % 10] +
			fraction[i]).replace(/零./, '')
		}

		s = s || '整'
		var n = Math.floor(num)
		for (var i = 0; i < unit[0].length && n > 0; i += 1) {
			var p = ''
			for (var j = 0; j < unit[1].length && n > 0; j += 1) {
				p = digit[n % 10] + unit[1][j] + p
				n = Math.floor(n / 10)
			}
			s = p.replace(/(零.)*零$/, '')
					.replace(/^$/, '零') + unit[0][i] + s
		}
		return s.replace(/(零.)*零元/, '元')
			.replace(/(零.)+/g, '零')
			.replace(/^整$/, '零元整')
	}

    showDlg=()=>{
        // 弹窗出现
        this.setState({
            modal1:true,
            urlContent: '<div>请复制下方链接，在浏览器中打开：</div>' +
             '<textarea readonly="readonly" id="execText" style="min-height:110px; margin:0px;">' + location.origin +
                "jjdApi/loanlater/protocol/getLoanAgreements?loanId=" + this.state.id +'&userId='+ $.getUserInfo().userId +'</textarea>'
        })
    }

    onClose = (key,copy) => () => {
        if(copy){
            if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                //获取版本号，如果IOS版本小于9，提示复制失败
                let ver = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                ver = parseInt(ver[1], 10);
                if(ver<=9)
                {
                    Toast.info('复制失败，请手动复制')
                    return;
                }

                var input = document.createElement("input");
                input.value = document.getElementById('execText').value;
                document.body.appendChild(input);
                input.readOnly = true;
                input.focus();
                input.setSelectionRange(0, input.value.length);
                document.execCommand('Copy');
                document.body.removeChild(input);
                // alert(document.execCommand('copy',true))
                // if(document.execCommand('Copy', false, null)){
                //     //可以复制
                // }else{
                //     Toast.info('复制失败，请手动复制')
                //     return
                // }
                this.setState({
                    [key]: false,
                },()=>{
                    Modal.infoX('复制成功！')
                })
            }else{                
                document.getElementById('execText').select();
                document.execCommand("Copy")
                this.setState({
                    [key]: false,
                },()=>{
                    Modal.infoX('复制成功！')
                })
            }
    
        }else{
            this.setState({
                [key]: false,
            })
        }
    }

    render() {
        let { userInfo} = this.state
        if(userInfo.versionNumber < 10){
            return (
                <div className='IOU_agreement'>
                    <div className="i-box">
                        <Tap onTap={() => { this.showDlg() }}>
                            <div className="showDig" style={{ display: this.state.isShow}}>下载协议</div>
                        </Tap>
                        
                        <h2 className="title">借款协议</h2>
                        <div>协议编号： {userInfo.originalId} </div>
                        {userInfo.originalId?<img className="ecloudsign" src={'/imgs/com/ecloudsign.png'} />:null}
    
                        <div>
                            为了使用今借到平台进行借贷交易，用户（以下或称“您”）应当事先阅读并同时遵守《借款协议》（以下简称“本协议”）及您与北京人人信科技有限公司（以下简称“人人信”）签署的相关服务协议（包括但不限于《用户注册协议》）。人人信依据本协议为您提供借贷交易的居间服务。
                        </div>
                        <div>
                            人人信在此特别提醒您认真阅读和充分理解本协议各条款，特别是其中所涉及的免除或限制人人信责任、限制用户权利、争议解决和法律适用条款。请您审慎阅读并选择是否接受本协议。除非您接受本协议所有条款，否则您无权使用今借到平台服务。您一经点击已阅读并同意本协议，即视为对本协议的理解和接受，您同意本协议对人人信和您具有法律约束力。如果您不同意本协议的任何内容或无法准确理解相关条款，请不要进行后续操作。
                        </div>
                        <div>本协议由以下各方在北京市海淀区签订：</div>
                        <div className="user">甲方（借款人）： {userInfo.borrowerName?userInfo.borrowerName+'（已认证）':null}</div>
                        <div className="user">甲方身份证号： {this.getHideIdCard(userInfo.borrowerIdCardNo)}</div>
                        <div className="user">甲方注册手机号：{userInfo.borrowerTelephone}</div>
                        <div className="user">乙方（出借人）：{userInfo.lenderName?userInfo.lenderName+'（已认证）':null}</div>
                        <div className="user">乙方身份证号：{this.getHideIdCard(userInfo.lenderIdCardNo)}</div>
                        <div className="user">乙方注册手机号：{userInfo.lenderTelephone}</div>
                        <div className="user">丙方（居间服务商）：北京人人信科技有限公司（“今借到”平台的运营管理人）</div>
                        <div className="user">客服电话：010-53565973</div>
                        {/* 判断是否显示担保人信息 */}
                        {}
                        <section>
                            {
                                userInfo.guaranteeName ? <div className="user">丁方（担保人）：{userInfo.guaranteeName}（已认证）</div>:null
                            }
                            {
                                userInfo.guaranteeIdCardNo ? <div className="user">丁方身份证号：{this.getHideIdCard(userInfo.guaranteeIdCardNo)}</div>:null
                            }
                            {
                                userInfo.guaranteeTelephone ? <div className="user">丁方注册手机号：{userInfo.guaranteeTelephone}</div> : null
                            }
                        </section>
                        <div className="user"></div>
                        <div>居间服务商（本合同丙方）为今借到平台（微信公众号“今借到”）的运营管理人，为借贷双方提供居间服务。借款人和出借人拟通过今借到平台进行资金借贷交易或寻求其他借贷服务。</div>
                        <div>甲、乙<span>、丁三</span><span>双</span>方均已在丙方平台注册，同意遵守丙方平台的各项行为准则，在充分阅读理解本文本情形下，本着诚信自愿原则签订本《借款协议》。本协议内容如下：
                        </div>
                        <section>
                            <h3>一、借款主要内容</h3>
                            <table>
                                <tr>
                                    <td>借款金额</td>
                                    <td>{$.toYuan(userInfo.amount)}</td>
                                    
                                </tr>
                                <tr>
                                    <td>借款日期</td>
                                    <td>{userInfo.borrowTime}</td>
                                </tr>
                                <tr>
                                    <td>还款方式</td>
                                    <td>{userInfo.repayTypeTxt}</td>
                                    
                                </tr>
                                {
                                    userInfo.repayType === 0 ?
                                    <tr>
                                        <td>还款日期</td>
                                        <td>{userInfo.repayTime}</td>
                                    </tr>:null
                                }
                                {
                                    userInfo.repayType === 1 ? 
                                    <tr>
                                        <td>还款期数</td>
                                        <td>{userInfo.period}期</td>
                                    </tr>:null
                                }
                               
                               
                                <tr>
                                    <td>年化利率</td>
                                    <td>{userInfo.interestRate}%</td>
                                    
                                </tr>
                                <tr>
                                    <td>借款用途</td>
                                    <td>{userInfo.purposeType}</td>
                                </tr>
                                <tr>
                                    <td>还款总额</td>
                                    <td>{parseFloat($.toYuan(userInfo.amount+userInfo.interestAmount)).toFixed(2)}({this.digitUppercase(parseFloat($.toYuan(userInfo.amount+userInfo.interestAmount)).toFixed(2))})</td>
                                    
                                </tr>
                            </table>
                            {userInfo.repayType==1?<div className="table_div">
                            <span>还款详情表</span>
                            <table>
                                <tr>
                                    <td>还款时间</td>
                                    <td>还款金额</td>
                                </tr>
                                 {this.state.repayList && this.state.repayList.map((item,index)=>{
                                    return <tr key={Math.random()}>
                                        <td>{(new Date(item.repayTime * 1000)).Format('yyyy-MM-dd')}</td>
                                        <td>{parseFloat($.toYuan(item.amount+item.interestAmount)).toFixed(2)}元({this.digitUppercase(parseFloat($.toYuan(item.amount+item.interestAmount)).toFixed(2))})</td>
                                    </tr>
                                })}
                            </table>
                            </div>:null}
                            
                            <div className="no-indent">注：还款总额=借款金额*（1+借款时长/365*年化利率），其中借款时长为借款日期和还款日期间的天数；此处的“借款日期”是指乙方向甲方实际支付借款且借款已到账的日期。</div>
                            <div className="no-indent">借款人可多次还款直至待还本息全部还清，但提前还款并不减少待还本息。</div>
                        </section>
                        <section>
                            <h3>二、借款流程</h3>
                            <h4>1、求借款流程</h4>
                            <div>
                                借款人在今借到平台发布借款需求，填写借款金额、年化利率、还款方式、还款期限、分期次数、服务费金额等基本信息，点击确定后发送至今借到平台求借款页面。该求借款信息仅借款人的好友可以看见。
                            </div>
                            <div>
                                看到上述求借款的借款人好友同意借款的，可立即进行支付。
                            </div>
                            <h4>2、申请出借流程</h4>
                            <div>
                                出借人在今借到平台发布出借，填写或选择借款金额、年化利率、还款方式、还款期限、分期次数、服务费比例等基本信息，点击确定后发送至今借到平台出借页面。该出借信息仅出借人的好友可以看见。
                            </div>
                            <div>
                                看到上述出借的出借人好友同意该出借的，可以申请此出借，经出借人审核同意，可立即进行支付。
                            </div>
                            <div className="no-indent">
                                注意：出借人通过今借到平台同意向借款人出借款项后，将出借资金存入出借人银行账户（以下简称“支付账户”），并授权人人信通过第三方支付机构将出借资金由出借人支付账户划转至借款人支付账户（经丙方转付），由于第三方支付机构的操作流程，出借人支付的借款到达人人信在第三方支付平台设立的账户后的次日，借款人方可取现。但借款人确认借款到达人人信在第三方支付平台设立的账户时，即视为出借人已履行了付款义务，即为借款成功，本协议同时生效，利息开始计算。
                            </div>
                        </section>
                        <section>
                            <h3>三、补借条流程</h3>
                            <div>
                                出借人和借款人在线下完成了借款资金的划转交割，需要通过今借到平台完善借款手续的，双方都可以在今借到平台起草借条，起草完成后点击发送按钮，即代表承认借条中约定的借款金额、起借日期、还款日期、年化利率等信息。在确认人确认该借条之前，起草人有权利将该借条删除。
                            </div>
                            <div>
                                确认人收到借条后，如果发觉借条载明信息有误，可以驳回给起草人；如果确认无误，点击确认借条按钮即代表认可借条中约定信息，确认后本协议即时生效。
                            </div>
                        </section>
                        <section>
                            <h3>四、借款费用</h3>
                            <h4>1、交易服务费</h4>
                            <div>
                                借款人应按双方约定的标准向丙方支付交易服务费 {userInfo.serviceAmount}元，作为丙方今借到平台提供信息促成双方交易的居间服务费。本协议生效的同时，借款人的该支付义务同时生效，该费用从出借人支付给借款人的款项中直接扣除，且不因任何原因退还借款人。补借条服务不支付该交易服务费。
                            </div>
                            <h4>
                                2、借款手续费
                            </h4>
                            <div>
                                借款人应按双方约定的标准向丙方支付交易手续费({(userInfo.amount/100/100).toFixed(2)} )元，用于丙方向第三方支付公司支付手续费以及丙方的账户管理费。本协议生效的同时，借款人的该支付义务同时生效，该费用从出借人支付给借款人的款项中直接扣除，且不因任何原因退还借款人。
                            </div>
                            <div>
                                补借条服务不支付该借款手续费。
                            </div>
                            <h4>
                                3、线上还款手续费（仅补借条服务有此费用）
                            </h4>
                            <div>
                                补借条服务如果通过今借到平台还款，需要按丙方规定支付还款金额的5‰。如果通过线下方式还款则无此手续费。
                            </div>
                            <div className="no-indent">
                                注意：今借到平台保留单方面制定及调整上述费用标准的权利。以上费用不影响借款双方使用今借到平台上的其他服务时应向丙方支付的其他服务费用。
                            </div>
                        </section>
                        <section>
                            <h3>五、偿还方式</h3>
                            <div className="no-indent">
                                1、借款人必须通过今借到平台偿还借款本息以及罚息、违约金等款项，但补借条服务除外。借款人必须按本协议的约定按时、足额偿还乙方的本金和利息，否则会对借款人的信用记录造成影响。还款日不受法定假日或公休日的影响，还款日前必须还款。
                            </div>
                            <div className="no-indent">
                                2、补借条服务的，借款人可以通过线上或者线下的方式予以还款，线上是指借款人通过今借到的账户系统将待还本息偿还到乙方的账户余额中，如果甲方采取此种还款方式，需按本协议前述约定向丙方支付线上还款手续费。
                            </div>
                            <div className="no-indent">
                                如果借款人通过支付宝、微信或现金等线下方式将待还本息偿还给了出借人，借款人需要在今借到平台上发起一个已还款提醒，出借人在收到该消息且核实已收到借款人的线下还款后，则可点击确认按钮以终结借条。如果乙方核实后发现没有收到甲方的线下还款，可以将该消息驳回或致电问询。
                            </div>
                            <div className="no-indent">
                                注意：如果甲方通过线下方式将本息偿还给了乙方，但未在今借到平台上发起已还款提醒，则今借到平台视为未还款，因此引起的一切后果由甲方自行承担。
                            </div>
                            <div className="no-indent">
                                3、借款人不得迟于本协议第一条约定的借款期限届满当日（以下简称“还款日”）22:00将全部借款本金、利息存入其支付账户。借款人在此不可撤销地授权：自还款日0:00起人人信指定的第三方支付机构可随时将借款人支付账户的资金划转至出借人支付账户（经丙方转付），前述划转金额以本协议项下未偿还的借款本金、利息、罚息（如有）、逾期管理费（如有）为限。出借人与借款人一致同意，自本协议生效之日起，出借人不得免除本协议项下借款人的部分或全部债务。
                            </div>
                            <div className="no-indent">
                                4、今借到有权在还款日之前向借款人发出还款提示。
                            </div>
                        </section>
                        <section>
                            <h3>六、承诺与保证</h3>
                            <div className="no-indent">
                                1、出借人保证其所用于出借的资金来源合法，系出借人的自有资金，出借人是该资金的合法所有人，如果第三方对资金归属、合法性问题发生争议，由出借人自行负责解决。如出借人未能解决，则放弃享有其所出借款项所带来的利息收益。
                            </div>
                            <div className="no-indent">
                                2、出借人承诺其拥有非保本类金融产品投资的经历并熟悉互联网。
                            </div>
                            <div className="no-indent">
                                3、借款人承诺，不会违反中国的法律法规、将所借资金用于违规或非法用途，否则由此造成的损失全部由借款人承担。
                            </div>
                        </section>
                        <section>
                            <h3>七、违约与还款能力降低</h3>
                            <h4>
                                1、借款人行为符合以下情形中任意一种的即视为违约，包括：
                            </h4>
                            <div>
                                （1）借款人交易到期未足额偿还借款本金、利息及相应费用的；
                            </div>
                            <div>
                                （2）违反中国的法律法规、将所借资金用于违规或非法用途的；
                            </div>
                            <div>
                                （3）借款人提供虚假资料或隐瞒重要事实的。
                            </div>
                            <h4>
                                2、借款人行为符合以下情形中之任意一种即视为还款能力降低：
                            </h4>
                            <div>
                                （1）在出借人以外任何第三方的其他借款、担保、赔偿、承诺或任何其他债务出现严重违约情况，影响或可能影响借款人还款能力的；
                            </div>
                            <div>
                                （2）部分或者全部丧失民事行为能力、死亡、被宣告死亡或者被宣告失踪，影响或可能影响借款人还款能力的；
                            </div>
                            <div>
                                （3）借款人被采取刑事强制措施，影响或可能影响借款人还款能力的；
                            </div>
                            <div>
                                （4）借款人财产被没收、征用、查封、损坏、扣押、冻结的或借款人财产遭受重大损失，影响或可能影响借款人还款能力的；
                            </div>
                            <div>
                                （5）出现任何其他影响或可能影响借款人还款能力的事件。
                            </div>
                            <h4>
                                3、若借款人发生违约行为或者还款能力降低事件，或根据出借人/今借到合理判断借款人可能发生本条第1款和第2款所述事件的，出借人有权委托人人信通过互联网在线和线下各种方式向借款人进行催收，出借人与借款人一致同意人人信有权采取下列任何一项、几项或全部措施予以债权救济：
                            </h4>
                            <div>
                                （1）立即取消全部或部分借款；
                            </div>
                            <div>
                                （2）宣布借款全部提前到期，借款人应立即偿还所有应付款，包括但不限于欠款本金、利息、罚息及其他各项相关费用等；
                            </div>
                            <div>
                                （3）解除本协议；
                            </div>
                            <div>
                                （4）在符合法律、法规相关规定的情况下采取适当的方式对借款人进行电话催收、上门催收、信函催收、委托第三方催收、司法诉讼催收、通过电视、报刊等媒体进行公告催收等，以及向有关部门或者单位予以通报；
                            </div>
                            <div>
                                （5）对借款人支付账户进行冻结、扣划等操作；
                            </div>
                            <div>
                                （6）对拒不归还欠款的，在今借到平台上向所有用户披露借款人的违约信息；
                            </div>
                            <div>
                                （7）将借款人违约情况和个人资料提供给依法成立的个人征信机构；
                            </div>
                            <div>
                                （8）采取法律、法规以及本协议约定的其他救济措施。
                            </div>
                            <div className="no-indent">
                                以上各项约定不影响出借人对借款人采取法律允许的任何催收措施及行动的权利与救济。出借人有权根据法律法规及本协议的约定向借款人进行催收。
                            </div>
                        </section>
                        <section>
                            <h3>八、罚息与费用</h3>
                            <div className="no-indent">
                                1、从还款日的次日计算罚息，以截至当日未偿还借款本金利息之和为基数，每日按年化利率24%计收罚息。
                            </div>
                            <div className="no-indent">
                                2、借款人通过求借款或申请出借完成借款(注:不包括通过补借条完成借款)，未按期还款，借款人未按期足额偿还借款本金、利息和罚息的，借款人应按照下述计算方式向人人信支付逾期管理费：
                            </div>
                            <div>
                                （1）自还款日次日起按“截至当日未偿还借款本金、利息与罚息之和×0.1%/天”的标准支付基础逾期管理费；
                            </div>
                            <div>
                                （2）如借款人自还款日后第15日22:00前未足额偿还本金、利息和罚息的，借款人应在基础逾期管理费之外再按“截至逾期第16日未偿还借款本金、利息、罚息与基础逾期管理费之和×5%”的标准向人人信支付特别逾期管理费；如借款人自还款日后第29日22:00前未足额偿还本金、利息和罚息的，特别逾期管理费的金额调整为“截至逾期第30日未偿还借款本金、利息、罚息与基础逾期管理费之和×10%”。
                            </div>
                            <div className="no-indent">
                                3、自还款日的次日起，借款人的每笔还款金额分为借款本金、利息、罚息与逾期管理费两个部分按比例偿还，两个部分占每笔还款金额的比例分别为：应还借款本金、利息、罚息的金额占应还借款本金、利息、罚息与应还逾期管理费总和之比；应还逾期管理费的金额占应还借款本金、利息、罚息与应还逾期管理费总和之比。
                            </div>
                            <div className="no-indent">
                                借款本金、利息、罚息的金额按照罚息、利息、借款本金的顺序依次偿还。
                            </div>
                        </section>
                        <section>
                            <h3>九、违约</h3>
                            <div>
                                甲已双方需保证其提供的信息和资料的真实性，不得提供虚假资料或隐瞒重要事实。提供虚假资料或者故意隐瞒重要事实的，构成违约，应承担违约责任；构成犯罪的，丙方将有权向相关国家机关报案，追究其刑事责任。
                            </div>
                            <div>
                                如果甲方没有按照约定按时、足额偿还对乙方的本金和利息，则甲方按本协议的约定承担违约责任。丙方作为信息中介，不承担对乙方未收回本息部分的代偿责任。丙方拥有将甲方违约失信的相关信息在媒体披露的权利，并且丙方会将甲方违约信息录入今借到平台黑名单以供他人查阅。
                            </div>
                        </section>
                        <section>
                            <h3>十、担保</h3>
                            <div className="no-indent">
                                1、如果本协议所涉及的借贷交易有担保人，则适用本条款。
                            </div>
                            <div className="no-indent">
                                2、为担保本合同项下借款人债务的履行，保证人愿意为借款人提供保证。
                            </div>
                            <div className="no-indent">
                                3、本合同的保证方式为连带责任保证。保证债务范围包括但不限于：1）应向出借人支付的借款本金、利息、罚息、违约金、赔偿金、实现债权的费用（包括但不限于诉讼费用、律师费用、公证费用、执行费用等）以及因债务人违约而给本合同债权人造成的损失和其他所有应付费用。2）应向人人信支付的服务费、交易手续费、线上还款手续费、逾期管理费、违约金、赔偿金、实现债权的费用（包括但不限于诉讼费用、律师费用、公证费用、执行费用等）以及因债务人违约而给人人信造成的损失和其他所有应付费用。
                            </div>
                            <div className="no-indent">
                                4、本合同的保证期间为借款成功之日，至借款人清偿完毕借款协议项下的包括但不限于保证债务范围内的所有应付款项。
                            </div>
                            <div className="no-indent">
                                5、担保人为借款人提供担保，借款人应向担保人支付担保费iou.n_guarantee_amt 元。该费用于出借人向借款人支付借款时由今借到平台直接扣留并转交担保人。借款人同意该费用支付方式。
                            </div>
                            <div className="no-indent">
                                6、借款人未按借款协议的约定按时、足额偿还借款本金和利息时，今借到平台会向担保人推送消息，告知借款逾期的事实同时限期担保人代替还款。担保人未能按通知要求代替还款，会对其信用记录造成影响。还款日不受法定假日或公休日的影响，还款日前必须还款。
                            </div>
                            <div className="no-indent">
                                7、担保人在此不可撤销地授权：如其未能承担担保责任按要求代替借款人还款，人人信指定的第三方支付机构可随时将担保人支付账户的资金划转至出借人支付账户（经丙方转付），前述划转金额以本协议项下的担保债务金额为限。出借人与借款人一致同意，自本协议生效之日起，出借人不得免除本协议项下担保人的部分或全部责任。
                            </div>
                            <div className="no-indent">
                                8、若主债权未受清偿，债权人在本合同约定的保证期间内要求保证人承担保证责任的，从债权人要求保证人承担保证责任之日起，保证债务开始起算并适用诉讼时效。
                            </div>
                        </section>
                        <section>
                            <h3>十一、债权转让</h3>
                            <div>
                                出借人有权将本协议项下的部分或全部债权转让给人人信（人人信根据债权情况决定是否接受）或今借到平台上的其他注册用户，出借人委托人人信将债权转让事项通过向借款人在今借到平台注册手机号码发送短信或平台信息推送的方式通知借款人。短信或平台信息推送一经发出即视为已通知借款人。
                            </div>
                            <div>
                                借款人同意，人人信将债权转让事项通知借款人时，可以不告知债权受让人的真实姓名，无论是否知晓债权受让人真实姓名，该债权转让均对借款人生效。
                            </div>
                            <div>
                                出借人转让债权后，本协议项下其他条款不受影响，债权受让人取代出借人享有本协议项下出借人的各项权利。
                            </div>
                            <div>
                                人人信同意接受出借人的债权转让的，按下一条“催收支持”执行。
                            </div>
                        </section>
                        <section>
                            <h3>十二、催收支持</h3>
                            <div>
                                借款人逾期60日未偿还借款的，经人人信同意，出借人可以委托人人信为其提供包括诉讼在内的催收服务，出借人可将本协议项下债权零对价转让给人人信，由人人信对借款人进行催收直至提起民事诉讼。上述诉讼所需费用（包括但不限于案件受理费、公告费、公证费等）在出借人与人人信签署债权转让协议时由人人信向债权人一次性收取。出借人拒绝缴纳上述诉讼费用或缴纳不足视为出借人自动放弃了相应的权利，人人信将停止后续诉讼服务，造成的后果由出借人自行承担。
                            </div>
                            <div>
                                通过上述诉讼追偿回的金额扣除逾期管理费后，人人信将全部返还给出借人。
                            </div>
                            <div>
                                出借人转让债权后可随时以零元价格从人人信回购该债权。
                            </div>
                            <div>
                                上述债权转让的具体内容将由出借人与人人信另行签订协议约定。
                            </div>
                            <div>
                                上述债权转让由原债权人委托人人信通过向借款人今借到平台注册手机号码发送短信或平台信息推送的方式通知借款人。短信或平台信息推送一经发出即视为已通知借款人。
                            </div>
                        </section>
                        <section>
                            <h3>十三、其他</h3>
                            <div>
                                本协议经甲、乙<span>、丁三</span><span>双</span>方通过丙方今借到平台以网络在线点击确认的方式签订，各方点击确认后本合同生效。由于今借到平台的业务流程，担保人在点击确认本协议时可能出借人尚未确定，但担保人在此不可撤销地确认其仍愿意为借款人提供担保，且一旦出借人点击确认本协议，本协议同时自动生效，而且在本协议履行过程中担保人不会以确认本协议时出借人尚未确定为由免除自己的担保责任。各方委托今借到平台保管所有与本协议有关的书面文件或电子信息，且认可“今借到”平台在未来发生的相关纠纷中向有关裁判机构提交该等文件信息的权利和证明争议事实的效力。
                            </div>
                            <div>
                                各方均确认，本协议的签订、生效和履行以不违反法律为前提。如果本协议中的任何一条或多条违反适用的法律，则该条将被视为无效，但该无效条款并不影响本协议其他条款的效力。
                            </div>
                            <div>
                                若甲方与丙方、乙方与丙方<span>、丁方与丙方</span>或甲乙丙<span>丁四</span><span>三</span>方发生任何纠纷或争议，首先应友好协商解决，协商不成的，同意将纠纷或争议提交丙方住所地有管辖权的人民法院，相关的诉讼费、律师代理费等因追索权利而发生的合理费用均由败诉方承担。
                            </div>
                            <div>
                                若甲方与乙方<span>、甲方与丁方、乙方与丁方</span>发生任何纠纷或争议，首先应友好协商解决，协商不成的，同意将纠纷或争议提交提起诉讼一方住所地有管辖权的人民法院，相关的诉讼费、律师代理费等因追索权利而发生的合理费用均由败诉方承担。
                            </div>
                            <div>
                                本协议中所使用的定义，除非另有规定，否则应适用今借到平台释义规则，今借到平台对本文定义享有最终解释权。
                            </div>
                        </section>
                        <img className="seal-size" src={'/imgs/com/seal2.png'} />
    
                        <div>甲方（借款人）：<span>{userInfo.borrowerName }</span>
                        </div>
                        <div>乙方（出借人）：<span>{userInfo.lenderName } </span>
                        </div>
                        <div>丙方（居间服务商）：<span>北京人人信科技有限公司</span>
                        </div>
                        {
                            userInfo.guaranteeName ? <div>丁方（担保人）:<span>{userInfo.guaranteeName}</span></div>:null
                        }
                       
                        
                        <div>签订日期：{userInfo.createTime} </div>
                        <div className="blank"></div>
                    </div>
                        {/* 弹窗模板 */}
                    <Modal
                        visible={this.state.modal1}
                        transparent
                        maskClosable={false}
                        onClose={this.onClose('modal1')}
                        title="提示"
                        footer={[
                            { text: '取消', onPress: () => { this.onClose('modal1')(); } },
                            { text: '复制', onPress: () => { this.onClose('modal1',true)(); } }]}
                        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                    >
                        <div style={{ height: 100, overflow: 'scroll' }} >
                            <div dangerouslySetInnerHTML={{ __html: this.state.urlContent }}></div>	
                        </div>
                    </Modal>  
    
                </div>
            )
        }

        return (
            <div className='IOU_agreement'>
                <div className="i-box">
                    <Tap onTap={() => { this.showDlg() }}>
                        <div className="showDig" style={{ display: this.state.isShow}}>下载协议</div>
                    </Tap>
                    
                    <h2 className="title">借款协议</h2>
                    <div>协议编号： {userInfo.originalId} </div>
                    {userInfo.originalId?<img className="ecloudsign" src={'/imgs/com/ecloudsign.png'} />:null}

                    <div>
                    为了使用今借到平台进行借贷交易，用户（以下或称“您”）应当事先阅读并同时遵守《借款协议》（以下简称“本协议”）及您与北京人人信科技有限公司（以下简称“人人信”）签署的相关服务协议（包括但不限于《用户注册协议》）。人人信根据本协议为您提供借贷交易的居间服务。
                    </div>
                    <div>
                    人人信在此特别提醒您认真阅读和充分理解本协议各条款，特别是其中所涉及的免除或限制人人信责任、限制用户权利、争议解决及法律适用条款。请您审慎阅读并选择是否接受本协议。除非您接受本协议所有条款，否则您无权使用今借到平台服务。您一经点击已阅读并同意本协议，即视为对本协议条款的理解和接受，您同意本协议对人人信和您具有法律约束力。如果您不同意本协议的任何内容或无法准确理解相关条款，请不要进行后续操作。
                    </div>
                    <div>本协议由以下各方在北京市海淀区签订：</div>
                    <div className="user">甲方（借款人）： {userInfo.borrowerName?userInfo.borrowerName+'（已认证）':null}</div>
                    <div className="user">甲方身份证号： {this.getHideIdCard(userInfo.borrowerIdCardNo)}</div>
                    <div className="user">甲方注册手机号：{userInfo.borrowerTelephone}</div>
                    <div className="user">乙方（出借人）：{userInfo.lenderName?userInfo.lenderName+'（已认证）':null}</div>
                    <div className="user">乙方身份证号：{this.getHideIdCard(userInfo.lenderIdCardNo)}</div>
                    <div className="user">乙方注册手机号：{userInfo.lenderTelephone}</div>
                    <div className="user">丙方（居间服务商）：北京人人信科技有限公司（“今借到”平台的运营管理人）</div>
                    <div className="user">客服电话：010-53565973</div>
                    {/* 判断是否显示担保人信息 */}
                    {}
                    <section>
                        {
                            userInfo.guaranteeName ? <div className="user">丁方（担保人）：{userInfo.guaranteeName}（已认证）</div>:null
                        }
                        {
                            userInfo.guaranteeIdCardNo ? <div className="user">丁方身份证号：{this.getHideIdCard(userInfo.guaranteeIdCardNo)}</div>:null
                        }
                        {
                            userInfo.guaranteeTelephone ? <div className="user">丁方注册手机号：{userInfo.guaranteeTelephone}</div> : null
                        }
                    </section>
                    <div className="user"></div>
                    <div> 居间服务商（本协议丙方）为今借到平台（微信公众号“今借到”）的运营管理主体，为借贷双方提供居间服务。借贷双方拟通过今借到平台进行资金借贷交易或寻求其他借贷服务。</div>
                    <div>
                    甲乙{userInfo.guaranteeName?<span>丁三</span>:<span>双</span>}方均已在今借到平台注册，同意遵守今借到平台的各项交易规则，在充分阅读理解本协议条款情形下，本着诚信自愿原则签订本协议。本协议内容如下：
                    </div>
                    <section>
                        <h3>一、借款主要内容</h3>
                        <table>
                            <tr>
                                <td>借款金额</td>
                                <td>{$.toYuan(userInfo.amount)}</td>
                                
                            </tr>
                            <tr>
                                <td>借款日期</td>
                                <td>{userInfo.borrowTime}</td>
                            </tr>
                            <tr>
                                <td>还款方式</td>
                                <td>{userInfo.repayTypeTxt}</td>
                                
                            </tr>
                            {
                                userInfo.repayType === 0 ?
                                <tr>
                                    <td>还款日期</td>
                                    <td>{userInfo.repayTime}</td>
                                </tr>:null
                            }
                            {
                                userInfo.repayType === 1 ? 
                                <tr>
                                    <td>还款期数</td>
                                    <td>{userInfo.period}期</td>
                                </tr>:null
                            }
                           
                           
                            <tr>
                                <td>年化利率</td>
                                <td>{userInfo.interestRate}%</td>
                                
                            </tr>
                            <tr>
                                <td>借款用途</td>
                                <td>{userInfo.purposeType}</td>
                            </tr>
                            <tr>
                                <td>还款总额</td>
                                <td>{parseFloat($.toYuan(userInfo.amount+userInfo.interestAmount)).toFixed(2)}({this.digitUppercase(parseFloat($.toYuan(userInfo.amount+userInfo.interestAmount)).toFixed(2))})</td>
                                
                            </tr>
                        </table>
                        {userInfo.repayType==1?<div className="table_div">
                            <span>还款详情表</span>
                            <table>
                                <tr>
                                    <td>还款时间</td>
                                    <td>还款金额</td>
                                </tr>
                                 {this.state.repayList && this.state.repayList.map((item,index)=>{
                                    return <tr key={Math.random()}>
                                        <td>{(new Date(item.repayTime * 1000)).Format('yyyy-MM-dd')}</td>
                                        <td>{parseFloat($.toYuan(item.amount+item.interestAmount)).toFixed(2)}元({this.digitUppercase(parseFloat($.toYuan(item.amount+item.interestAmount)).toFixed(2))})</td>
                                    </tr>
                                })}
                            </table>
                            </div>:null}
                        <div className="no-indent">注：还款总额=借款金额×（1+借款时长/365×年化利率），其中借款期限为借款日期和还款日期间的自然日天数；此处的“借款日期”是指乙方向甲方实际提供借款且借款已到账的日期。甲方可多次还款直至待还本息全部还清，但提前还款并不减少待还本息。</div>
                        </section>
                    <section>
                        <h3>二、借款流程</h3>
                        <h4>1、借款申请流程</h4>
                        <div>甲方在今借到平台发布借款需求，填写借款金额、年化利率、还款方式、还款期限、分期次数、服务费金额等基本信息，点击确定后发送至今借到平台求借款产品页面。该求借款产品信息仅甲方的好友可以看见。
                        </div>
                        <div>看到上述求借款产品的甲方好友同意借款的，可立即进行支付。</div>
                        <h4>2、申请贷款流程</h4>
                        <div>乙方在今借到平台发布贷款产品，填写或选择借款金额、年化利率、还款方式、还款期限、分期次数、服务费比例等基本信息，点击确定后发送至今借到平台贷款产品页面。该贷款产品信息仅乙方的好友可以看见。
                        </div>
                        <div>看到上述贷款产品的乙方好友同意该贷款产品的，可以申请此贷款，经乙方审核同意，可立即进行支付。
                        </div>
                        <div className="no-indent">注意：乙方通过今借到平台同意向甲方出借款项后，需将出借资金存入乙方银行账户（以下简称“支付账户”），并授权人人信通过第三方支付机构将出借资金由乙方账户划转至甲方账户（经丙方转付），经第三方支付机构的操作流程，乙方提供的出借资金到达人人信在第三方支付平台设立的账户后的次日，甲方方可取现。但甲方确认借款到达人人信在第三方支付平台设立的账户时，即视为乙方已履行了付款义务，即为借款成功，利息即日起开始计算。
                        </div>
                    </section>
                    <section>
                        <h3>三、补借条流程及极速借条流程</h3>
                        <h4>（一）补借条流程</h4>
                        <div>1、甲乙双方在线下完成了借款资金的划转交割，需要通过今借到平台完善借款手续的，双方均可在今借到平台起草借条，起草完成后点击发送按钮，即代表承认借条中约定的借款金额、起借日期、还款日期、年化利率等信息。在确认人确认该借条之前，起草人有权利将该借条删除。
                        </div>
                        <div>2、确认人收到借条后，如果发现借条载明信息有误，可以驳回给起草人；如果确认无误，点击确认借条按钮即代表认可借条中约定信息，确认后本协议即时生效。
                        </div>
                        <h4>（二）极速借条流程</h4>
                        <div>1、甲乙双方在线下完成了借款资金的划转，如需通过今借到平台完善借款手续的，双方均可在今借到平台起草借条，起草完成后点击发送按钮，即代表承认借条中约定的借款金额、起借日期、还款日期、年化利率等信息。在确认人确认该借条之前，起草人有权利将该借条删除。
                        </div>
                        <div>2、确认人收到借条后，如果发现借条载明信息有误的，可以驳回给起草人；如果确认无误，点击确认借条按钮即代表认可借条中约定信息，确认后借条即时生效。
                        </div>
                        <div>3、甲方起草借条完成后点击发送按钮时，或确认借条信息后点击确认借条按钮时，需向今借到平台支付极速借条手续费共计人民币8元。
                        </div>
                        <div className="no-indent">注意：今借到平台保留单方面制定及调整上述费用标准的权利。以上费用不影响甲乙双方使用今借到平台上的其他服务时应向丙方支付的其他服务费用。
                        </div>
                    </section>
                    <section>
                        <h3>四、服务费用</h3>
                        <h4>1、交易服务费</h4>
                        <div>甲方应按经甲方与乙方约定的标准向丙方支付交易服务费共计人民币 {userInfo.serviceAmount}元，作为丙方提供信息促成双方交易的居间服务费。本协议生效的同时，甲方的该支付义务同时生效，该费用从乙方提供给甲方的款项中直接予以扣除，该费用不因任何原因退还给甲方。
                        </div>
                        <div>补借条服务及极速借条服务无需支付该服务费。
                        </div>
                        <h4>
                            2、交易手续费
                        </h4>
                        <div>甲方应按经甲方与乙方约定的标准向丙方支付交易手续费共计人民币{Math.round(parseInt(userInfo.amount/100/100*100))/100} 元，用于丙方向第三方支付公司支付手续费以及丙方的账户管理费。本协议生效的同时，甲方的该支付义务同时生效，该费用从乙方提供给甲方的款项中直接予以扣除，该费用不因任何原因退还给甲方。
                        </div>
                        <div>
                            补借条服务及极速借条服务无需支付该手续费。
                        </div>
                        <h4>
                            3、线上还款手续费（仅适用于补借条服务及极速借条服务）
                        </h4>
                        <div>
                        补借条服务及极速借条服务如需通过今借到平台还款，甲方需要按丙方规定支付线上还款手续费千分之五。如果通过线下方式还款则无此手续费。
                        </div>
                        <div className="no-indent">
                        注意：丙方保留单方面制定及调整上述费用标准的权利。以上费用不影响甲乙双方使用今借到平台上的其他服务时应向丙方支付的其他服务费用。
                        </div>
                    </section>
                    <section>
                        <h3>五、偿还方式</h3>
                        <div className="no-indent">
                        1、甲方必须通过今借到平台偿还借款本金、利息以及罚息、违约金等款项，但补借条服务及极速借条服务除外。甲方必须按本协议的约定按时、足额偿还乙方的本金和利息，否则会对甲方的信用记录造成不良影响。还款日不受法定假日或公休日的影响，还款日当日甲方需履行还款义务。
                        </div>
                        <div className="no-indent">
                        2、如为补借条服务或极速借条服务的，甲方可以通过线上或者线下的方式进行还款，线上还款是指甲方通过今借到的账户系统将待还本息支付至乙方的账户中，如果甲方采取此种还款方式，需按本协议前述约定向丙方支付线上还款手续费。
                        </div>
                        <div className="no-indent">
                        如果甲方通过支付宝、微信或现金等线下方式将待还本息偿还给了乙方，借甲方需要在今借到平台上发起一个已还款提醒，乙方在收到该消息且核实已收到甲方的线下还款后，则可点击确认按钮以终结借条。如果乙方核实后发现没有收到甲方的线下还款，可以将该消息驳回或致电问询。
                        </div>
                        <div className="no-indent">
                        注意：如果甲方通过线下方式将本息偿还给了乙方，但未在今借到平台上发起已还款提醒，则今借到平台视为其未还款，因此引起的一切后果均由甲方自行承担。
                        </div>
                        <div className="no-indent">
                        3、甲方不得迟于本协议第一条约定的还款日当日22:00将全部借款本金、利息存入其支付账户。甲方在此不可撤销地授权：自还款日0:00起人人信指定的第三方支付机构可随时将甲方支付账户的资金划转至乙方支付账户（经丙方转付），前述划转金额以本协议项下未偿还的借款本金、利息、罚息（如有）、逾期管理费（如有）为限。甲乙双方一致同意，自本协议生效之日起，乙方不得免除本协议项下甲方的部分或全部债务。
                        </div>
                        <div className="no-indent">
                        4、今借到平台有权在还款日之前随时向甲方发出还款提示。
                        </div>
                    </section>
                    <section>
                        <h3>六、承诺与保证</h3>
                        <div className="no-indent">
                        1、乙方保证其所用于出借的资金来源合法，系乙方的自有资金，乙方是该资金的合法所有人，如果因第三方对资金归属、合法性问题发生纠纷的，由乙方自行负责解决。如乙方未能解决，则视为其放弃享有其所出借款项所带来的利息收益。
                        </div>
                        <div className="no-indent">
                        2、乙方承诺其拥有非保本类金融产品投资的经历并熟悉互联网。
                        </div>
                        <div className="no-indent">
                        3、甲方承诺，不会违反中国的法律法规、将所借资金用于违规或非法用途，否则由此造成的任何后果均由甲方承担。
                        </div>
                    </section>
                    <section>
                        <h3>七、违约与还款能力降低</h3>
                        <h4>
                            1、甲方行为符合以下情形之任意一种的即视为其违约，包括：
                        </h4>
                        <div>
                            （1）甲方交易到期未足额偿还借款本金、利息及相应费用的；
                        </div>
                        <div>
                            （2）违反中国的法律法规、将所借资金用于违规或非法用途的；
                        </div>
                        <div>
                            （3）甲方提供虚假资料或隐瞒重要事实的。
                        </div>
                        <h4>
                            2、甲方行为符合以下情形中之任意一种的即视为其还款能力降低，包括：
                        </h4>
                        <div>
                            （1）在乙方以外任何第三方的其他借款、担保、赔偿、承诺或任何其他债务出现严重违约情况，影响或可能影响甲方还款能力的；
                        </div>
                        <div>
                            （2）部分或者全部丧失民事行为能力、死亡、被宣告死亡或者被宣告失踪，影响或可能影响甲方还款能力的；
                        </div>
                        <div>
                            （3）甲方被采取刑事强制措施，影响或可能影响甲方还款能力的；
                        </div>
                        <div>
                            （4）甲方财产被没收、征用、查封、损坏、扣押、冻结的或甲方财产遭受重大损失，影响或可能影响甲方还款能力的；
                        </div>
                        <div>
                            （5）出现任何其他影响或可能影响甲方还款能力的事件。
                        </div>
                        <h4>
                            3、若甲方发生违约行为或者还款能力降低事件，或根据乙方/今借到平台合理判断甲方可能发生本条第1款和第2款所述事件的，甲方有权委托人人信通过互联网在线和线下各种方式向甲方进行催收，甲乙双方一致同意人人信有权采取下列任何一项、几项或全部措施予以债权救济：
                        </h4>
                        <div>
                            （1）立即取消全部或部分借款；
                        </div>
                        <div>
                            （2）宣布借款全部提前到期，甲方应立即偿还所有应付款项，包括但不限于应还本金、利息、罚息及其他各项相关费用等；
                        </div>
                        <div>
                            （3）解除本协议；
                        </div>
                        <div>
                            （4）在符合法律、法规相关规定的情况下采取适当的方式对甲方进行电话催收、上门催收、信函催收、委托第三方催收、司法诉讼催收、通过电视、报刊等媒体进行公告催收等，以及向有关部门或者单位予以通报；
                        </div>
                        <div>
                            （5）对甲方支付账户进行冻结、扣划等操作；
                        </div>
                        <div>
                            （6）对拒不归还欠款的，在今借到平台上向所有用户披露甲方的违约信息；
                        </div>
                        <div>
                            （7）将甲方违约情况和个人资料提供给依法成立的个人征信机构；
                        </div>
                        <div>
                            （8）采取法律、法规以及本协议约定的其他救济措施。
                        </div>
                        <div className="no-indent">
                        以上各项约定不影响乙方对甲方采取法律允许的任何催收措施及行动的权利与救济。乙方有权根据法律法规及本协议的约定要求甲方履行还款义务。
                        </div>
                    </section>
                    <section>
                        <h3>八、罚息与费用</h3>
                        <div className="no-indent">
                            1、自还款日的次日起计算罚息，以截至当日未偿还借款本金利息之和为基数，每日按年化利率24%计收罚息。
                        </div>
                        <div className="no-indent">
                            2、甲方（不包括通过补借条或极速借条完成借款）未按期足额偿还借款本金、利息和罚息的，甲方自还款日次日起向丙方按每日一元的费用标准支付逾期管理费；
                        </div>
                        <div className="no-indent">
                            3、自还款日次日起，甲方的每笔还款金额包括借款本金、利息、罚息与逾期管理费两个部分，两个部分占每笔还款金额的比例分别为：应还借款本金、利息、罚息的金额占应还借款本金、利息、罚息与应还逾期管理费总和之比；应还逾期管理费的金额占应还借款本金、利息、罚息与应还逾期管理费总和之比。
                        </div>
                        <div className="no-indent">
                            借款本金、利息、罚息的金额按照罚息、利息、借款本金的顺序依次偿还。
                        </div>
                    </section>
                    <section>
                        <h3>九、违约</h3>
                        <div className="no-indent">
                        1、甲乙双方需保证其提供的信息和资料的真实性，不得提供虚假资料或隐瞒重要事实。提供虚假资料或者故意隐瞒重要事实的，构成违约，应承担违约责任；构成犯罪的，丙方将有权向相关国家机关报案，追究其刑事责任。
                        </div>
                        <div className="no-indent">
                        2、如果甲方没有按照约定按时、足额向乙方偿还对借款本金和利息，则甲方按本协议的约定承担违约责任。丙方作为信息中介，不承担对乙方未收回本息部分的任何代偿责任。丙方拥有将甲方违约失信的相关信息在媒体披露的权利，并且丙方会将甲方违约信息录入今借到平台黑名单以供他人查阅。
                        </div>
                    </section>
                    <section>
                        <h3>十、担保</h3>
                        <div className="no-indent">
                            1、如果本协议所涉及的借贷交易有担保人，则适用本条款。
                        </div>
                        <div className="no-indent">
                            2、为担保本合同项下甲方债务的履行，丁方愿意为甲方提供保证。
                        </div>
                        <div className="no-indent">
                            3、本合同的保证方式为连带责任保证。保证债务范围包括但不限于：
                            <div>（1）应向乙方支付的借款本金、利息、罚息、违约金、赔偿金、实现债权的费用（包括但不限于诉讼费用、律师费用、公证费用、执行费用等）以及因甲方违约而给乙方造成的损失和其他所有应付费用；</div>
                            <div>（2）应向人人信支付的服务费、交易手续费、线上还款手续费、逾期管理费、违约金、赔偿金、实现债权的费用（包括但不限于诉讼费用、律师费用、公证费用、执行费用等）以及因甲方违约而给人人信造成的损失和其他所有应付费用。</div>
                        </div>
                        <div className="no-indent">
                            4、本需要的保证期间为借款成功之日至借款人清偿完毕本协议项下的包括但不限于保证债务范围内的所有应付款项之日。
                        </div>
                        <div className="no-indent">
                            5、丁方为甲方提供担保，甲方应向丁方支付担保费共计人民币{userInfo.n_guarantee_amt}元。该费用自乙方向甲方支付借款时由今借到平台直接扣留并转交至丁方。甲方同意支付该费用。
                        </div>
                        <div className="no-indent">
                            6、甲方未按本协议的约定按时、足额偿还借款本金和利息时，今借到平台会向丁方推送消息，告知借款逾期的事实同时限期丁方代替还款。丁方未能按通知要求代替还款的，会对其信用记录造成不良影响。还款日不受法定假日或公休日的影响，还款日当日丁方需履行还款义务。
                        </div>
                        <div className="no-indent">
                            7、丁方在此不可撤销地授权：如其未能承担担保责任按要求代替借款人还款，人人信指定的第三方支付机构可随时将担保人支付账户的资金划转至乙方支付账户（经丙方转付），前述划转金额以本协议项下的担保债务金额为限。甲乙双方一致同意，自本协议生效之日起，乙方不得免除本协议项下丁方的部分或全部担保责任。
                        </div>
                        <div className="no-indent">
                            8、若主债权未受清偿，乙方在本协议约定的保证期间内要求丁方承担保证责任的，从乙方要求丁方承担保证责任之日起，保证债务开始起算并适用诉讼时效。
                        </div>
                    </section>
                    <section>
                        <h3>十一、债权转让</h3>
                        <div>
                        1、乙方有权将本协议项下的部分或全部债权转让给人人信（人人信根据债权情况决定是否接受）或今借到平台上的其他注册用户，乙方委托人人信将债权转让事项通过向甲方在今借到平台注册手机号码发送短信或平台信息推送的方式通知甲方。短信或平台信息推送一经发出即视为已通知甲方。
                        </div>
                        <div>
                        2、甲方同意，人人信将债权转让事项通知其时，可以不告知债权受让人的真实姓名，无论是否知晓债权受让人真实姓名，该债权转让均对甲方生效。  
                        </div>
                        <div>
                        3、乙方转让债权后，本协议项下其他条款不受影响，债权受让人取代乙方享有本协议项下乙方的各项权利。    
                        </div>
                        <div>
                        4、人人信同意接受乙方的债权转让的，按本协议第十二条之规定执行。
                        </div>
                    </section>
                    <section>
                        <h3>十二、催收支持</h3>
                        <div>
                        1、甲方逾期60日未偿还借款的，经人人信同意，乙方可以委托人人信为其提供包括诉讼在内的催收服务，乙方可将本协议项下债权零对价转让给人人信，由人人信对甲方进行催收直至提起民事诉讼。上述诉讼所需费用（包括但不限于案件受理费、公告费、公证费等）在乙方与人人信签署债权转让协议时由人人信向乙方一次性收取。乙方拒绝缴纳上述诉讼费用或缴纳不足视为乙方自动放弃了相应的权利，人人信将停止后续诉讼服务，造成的后果由乙方自行承担。
                        </div>
                        <div>
                        2、通过上述催收追回的金额扣除逾期管理费后，人人信将全部返还给乙方。
                        </div>
                        <div>
                        3、乙方转让债权后可随时以零元价格从人人信回购该债权。
                        </div>
                        <div>
                        4、上述债权转让的具体内容将由乙方与人人信另行签订协议约定。
                        </div>
                        <div>
                        5、上述债权转让由原债权人委托人人信通过向甲方今借到平台注册手机号码发送短信或平台信息推送的方式通知甲方。短信或平台信息推送一经发出即视为已通知甲方。
                        </div>
                    </section>
                    <section>
                        <h3>十三、其他</h3>
                        <div>
                        1、本协议经甲乙双方通过丙方今借到平台以网络在线点击确认的方式进行签订，各方点击确认后本协议生效。由于今借到平台的业务流程，丁方在点击确认本协议时可能乙方尚未确定，但丁方在此不可撤销地确认其仍愿意为甲方提供担保，且一旦乙方点击确认本协议，本协议同时自动生效，且在本协议履行过程中丁方不会以确认本协议时乙方尚未确定为由免除自己的担保责任。各方委托今借到平台保管所有与本协议有关的书面文件或电子信息，且认可今借到平台在未来发生的相关纠纷中向有关裁判机构提交该等文件信息的权利和证明争议事实的效力。
                        </div>
                        <div>
                        2、各方均确认，本协议的签订、生效和履行以不违反法律为前提。如果本协议中的任何一条或多条违反适用的法律，则该条将被视为无效，但该无效条款并不影响本协议其他条款的效力。
                        </div>
                        <div>
                        3、若甲方与丙方、乙方与丙方或甲乙丙三方发生任何纠纷或争议，首先应友好协商解决，协商不成的，同意将纠纷或争议提交丙方住所地有管辖权的人民法院，相关的诉讼费、律师代理费等因追索权利而发生的合理费用均由败诉方承担。
                        </div>
                        <div>
                        4、若甲方与乙方发生任何纠纷或争议，首先应友好协商解决，协商不成的，同意将纠纷或争议提交提起原告住所地有管辖权的人民法院，相关的诉讼费、律师代理费等因追索权利而发生的合理费用均由败诉方承担。
                        </div>
                        <div>
                        5、本协议中所使用的定义，除非另有规定，否则应适用今借到平台释义规则，今借到平台对本文定义享有最终解释权。  
                        </div>
                    </section>
                    <img className="seal-size" src={'/imgs/com/seal2.png'} />

                    <div>甲方（借款人）：<span>{userInfo.borrowerName }</span>
                    </div>
                    <div>乙方（出借人）：<span>{userInfo.lenderName } </span>
                    </div>
                    <div>丙方（居间服务商）：<span>北京人人信科技有限公司</span>
                    </div>
                    {
                        userInfo.guaranteeName ? <div>丁方（担保人）:<span>{userInfo.guaranteeName}</span></div>:null
                    }
                   
                    
                    <div>签订日期：{userInfo.createTime} </div>
                    <div className="blank"></div>
                </div>
                    {/* 弹窗模板 */}
                <Modal
                    visible={this.state.modal1}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose('modal1')}
                    title="提示"
                    footer={[
                        { text: '取消', onPress: () => { this.onClose('modal1')(); } },
                        { text: '复制', onPress: () => { this.onClose('modal1',true)(); } }]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <div style={{ height: 100, overflow: 'scroll' }} >
                        <div dangerouslySetInnerHTML={{ __html: this.state.urlContent }}></div>	
                    </div>
                </Modal>


            </div>
        )
        
        
    }
}
