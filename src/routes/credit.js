
import Loadable from 'react-loadable'

//信用认证
export default [
    {
        // 信用认证
        path: '/credit/report_simple',
        component: Loadable({
            loader: () => import('VIEW/credit/report_simple'),
            loading: () => null
        })
    },
    {   
        // 信用认证
        path: '/credit/report_info',
        component:Loadable({
            loader: () => import('VIEW/credit/report_info'),
            loading: ()=>null
        })
    }, {   
        // 电商收货地址
        path: '/credit/address_record',
        component:Loadable({
            loader: () => import('VIEW/credit/address_record'),
            loading: ()=>null
        })
    },{   
        // 信用认证
        path: '/credit',
        component:Loadable({
            loader: () => import('VIEW/credit/index'),
            loading: ()=>null
        })
    }, {   
        // 公积金认证第一步
        path: '/credit/accumulation_first',
        component:Loadable({
            loader: () => import('VIEW/credit/accumulation_first'),
            loading: ()=>null
        })
    }, {   
        // 公积金认证第二步
        path: '/credit/accumulation_second',
        component:Loadable({
            loader: () => import('VIEW/credit/accumulation_second'),
            loading: ()=>null
        })
    }, {   
        // 公积金认证第二步
        path: '/credit/accumulation_third',
        component:Loadable({
            loader: () => import('VIEW/credit/accumulation_third'),
            loading: ()=>null
        })
    }, {   
        // 公积金缴费详情
        path: '/credit/accumulation_record',
        component:Loadable({
            loader: () => import('VIEW/credit/accumulation_record'),
            loading: ()=>null
        })
    }, {   
        // 基础信息
        path: '/credit/base',
        component:Loadable({
            loader: () => import('VIEW/credit/base'),
            loading: ()=>null
        })
    }, {   
        // 借入记录
        path: '/credit/borrow_record',
        component:Loadable({
            loader: () => import('VIEW/credit/borrow_record'),
            loading: ()=>null
        })
    }, {   
        // 通话记录详情
        path: '/credit/call_record',
        component:Loadable({
            loader: () => import('VIEW/credit/call_record'),
            loading: ()=>null
        })
    }, {   
        // 紧急联系人详情
        path: '/credit/emergency_contact',
        component:Loadable({
            loader: () => import('VIEW/credit/emergency_contact'),
            loading: ()=>null
        })
    }, {   
        // 车产
        path: '/credit/car',
        component:Loadable({
            loader: () => import('VIEW/credit/car'),
            loading: ()=>null
        })
    }, {   
        // 数字证书
        path: '/credit/certificate',
        component:Loadable({
            loader: () => import('VIEW/credit/certificate'),
            loading: ()=>null
        })
    }, {   
        // 消费详情
        path: '/credit/consumption_record',
        component:Loadable({
            loader: () => import('VIEW/credit/consumption_record'),
            loading: ()=>null
        })
    }, {   
        // 担保纪录
        path: '/credit/guarantee_record',
        component:Loadable({
            loader: () => import('VIEW/credit/guarantee_record'),
            loading: ()=>null
        })
    }, {   
        // 房产
        path: '/credit/house',
        component:Loadable({
            loader: () => import('VIEW/credit/house'),
            loading: ()=>null
        })
    }, {   
        // 收入信息
        path: '/credit/income',
        component:Loadable({
            loader: () => import('VIEW/credit/income'),
            loading: ()=>null
        })
    }, {   
        // 京东第一步
        path: '/credit/jingdong_first',
        component:Loadable({
            loader: () => import('VIEW/credit/jingdong_first'),
            loading: ()=>null
        })
    }, {   
        // 京东第二步
        path: '/credit/jingdong_second',
        component:Loadable({
            loader: () => import('VIEW/credit/jingdong_second'),
            loading: ()=>null
        })
    }, {   
        // 工作
        path: '/credit/job',
        component:Loadable({
            loader: () => import('VIEW/credit/job'),
            loading: ()=>null
        })
    }, {   
        // 借出记录
        path: '/credit/lend_record',
        component:Loadable({
            loader: () => import('VIEW/credit/lend_record'),
            loading: ()=>null
        })
    }, {   
        // 完善信用认证
        path: '/credit/nocredit_report',
        component:Loadable({
            loader: () => import('VIEW/credit/nocredit_report'),
            loading: ()=>null
        })
    }, {   
        // 运营商认证第一步
        path: '/credit/operator_first',
        component:Loadable({
            loader: () => import('VIEW/credit/operator_first'),
            loading: ()=>null
        })
    }, {   
        // 运营商认证第二步
        path: '/credit/operator_second',
        component:Loadable({
            loader: () => import('VIEW/credit/operator_second'),
            loading: ()=>null
        })
    }, {   
        // 运营商认证第三步
        path: '/credit/operator_third',
        component:Loadable({
            loader: () => import('VIEW/credit/operator_third'),
            loading: ()=>null
        })
    }, {   
        // 运营商认证第四步
        path: '/credit/operator_four',
        component:Loadable({
            loader: () => import('VIEW/credit/operator_four'),
            loading: ()=>null
        })
    }, {   
        // 运营商认证帮助1
        path: '/credit/operator_help1',
        component:Loadable({
            loader: () => import('VIEW/credit/operator_help1'),
            loading: ()=>null
        })
    }, {   
        // 运营商认证帮助2
        path: '/credit/operator_help2',
        component:Loadable({
            loader: () => import('VIEW/credit/operator_help2'),
            loading: ()=>null
        })
    }, {   
        // 逾期记录
        path: '/credit/overdue_record',
        component:Loadable({
            loader: () => import('VIEW/credit/overdue_record'),
            loading: ()=>null
        })
    }, {   
        // 支付信用报告
        path: '/credit/pay_credit',
        component:Loadable({
            loader: () => import('VIEW/credit/pay_credit'),
            loading: ()=>null
        })
    }, {   
        // 定位
        path: '/credit/position',
        component:Loadable({
            loader: () => import('VIEW/credit/position'),
            loading: ()=>null
        })
    }, {   
        // 举报记录
        path: '/credit/reported_record',
        component:Loadable({
            loader: () => import('VIEW/credit/reported_record'),
            loading: ()=>null
        })
    }, {   
        // 设置备注
        path: '/credit/set_remarks',
        component:Loadable({
            loader: () => import('VIEW/credit/set_remarks'),
            loading: ()=>null
        })
    }, {   
        // 社保第一步
        path: '/credit/social_security_first',
        component:Loadable({
            loader: () => import('VIEW/credit/social_security_first'),
            loading: ()=>null
        })
    }, {   
        // 社保第二步
        path: '/credit/social_security_second',
        component:Loadable({
            loader: () => import('VIEW/credit/social_security_second'),
            loading: ()=>null
        })
    }, {   
        // 社保第三步
        path: '/credit/social_security_third',
        component:Loadable({
            loader: () => import('VIEW/credit/social_security_third'),
            loading: ()=>null
        })
    }, {   
        // 社保缴费详情
        path: '/credit/social_security_record',
        component:Loadable({
            loader: () => import('VIEW/credit/social_security_record'),
            loading: ()=>null
        })
    }, {   
        // 话费详情
        path: '/credit/tel_record',
        component:Loadable({
            loader: () => import('VIEW/credit/tel_record'),
            loading: ()=>null
        })
    }, {   
        // 学信认证
        path: '/credit/xuexin',
        component:Loadable({
            loader: () => import('VIEW/credit/xuexin'),
            loading: ()=>null
        })
    }, {   
        // 学信认证
        path: '/credit/xuexin_first',
        component:Loadable({
            loader: () => import('VIEW/credit/xuexin_first'),
            loading: ()=>null
        })
    }, {   
        // 高法失信
        path: '/credit/gfsx',
        component:Loadable({
            loader: () => import('VIEW/credit/gfsx'),
            loading: ()=>null
        })
    }, {   
        // 支付宝增强验证-人脸识别
        path: '/credit/zhifubao_face',
        component:Loadable({
            loader: () => import('VIEW/credit/zhifubao_face'),
            loading: ()=>null
        })
    }, {   
        // 支付宝验证码登录
        path: '/credit/zhifubao_login',
        component:Loadable({
            loader: () => import('VIEW/credit/zhifubao_login'),
            loading: ()=>null
        })
    }, {   
        // 支付宝密码登录
        path: '/credit/zhifubao_pwd',
        component:Loadable({
            loader: () => import('VIEW/credit/zhifubao_pwd'),
            loading: ()=>null
        })
    }, {   
        // 支付宝增强验证-验证码
        path: '/credit/zhifubao_verify1',
        component:Loadable({
            loader: () => import('VIEW/credit/zhifubao_verify1'),
            loading: ()=>null
        })
    }, {   
        // 支付宝增强验证-姓名
        path: '/credit/zhifubao_verify2',
        component:Loadable({
            loader: () => import('VIEW/credit/zhifubao_verify2'),
            loading: ()=>null
        })
    }, {   
        // 支付宝增强验证-身份证号
        path: '/credit/zhifubao_verify3',
        component:Loadable({
            loader: () => import('VIEW/credit/zhifubao_verify3'),
            loading: ()=>null
        })
    }, {   
        // 支付宝增强验证-证件号和银行卡号
        path: '/credit/zhifubao_verify4',
        component:Loadable({
            loader: () => import('VIEW/credit/zhifubao_verify4'),
            loading: ()=>null
        })
    }, {   
        // 支付宝增强验证-证件号和银行卡号
        path: '/credit/zhifubao_verify5',
        component:Loadable({
            loader: () => import('VIEW/credit/zhifubao_verify5'),
            loading: ()=>null
        })
    }, {   
        // 支付宝增强验证-可能认识的人（列表）
        path: '/credit/zhifubao_verify6',
        component:Loadable({
            loader: () => import('VIEW/credit/zhifubao_verify6'),
            loading: ()=>null
        })
    }, {   
        // 支付宝增强验证-九宫格
        path: '/credit/zhifubao_verify7',
        component:Loadable({
            loader: () => import('VIEW/credit/zhifubao_verify7'),
            loading: ()=>null
        })
    }, {   
        // 信用报告-负面记录
        path: '/credit/alipay_negative',
        component:Loadable({
            loader: () => import('VIEW/credit/alipay_negative'),
            loading: ()=>null
        })
    }, {   
        // 信用报告-交易详情
        path: '/credit/alipay_record',
        component:Loadable({
            loader: () => import('VIEW/credit/alipay_record'),
            loading: ()=>null
        })
    }
    
    
]