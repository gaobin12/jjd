require('promise.prototype.finally').shim();
import React from 'react'
import {render} from 'react-dom'
import { Router, Route} from 'react-router-dom'
import createHashHistory from 'history/createHashHistory'
import { Provider } from 'mobx-react'
import store from './mobx/store'
import routes from './routes'

import Layout from 'VIEW/layout/index'
import init from 'SERVICE'
init()

const history = createHashHistory();

render(
    <Provider {...store}>
      <Router history={history} >
        <Layout>
            {routes.map((r,i)=>{
                return <Route exact key={i} path={r.path} component={r.component} />
            })}
        </Layout>
      </Router>
    </Provider>,
    document.getElementById('app')
  )