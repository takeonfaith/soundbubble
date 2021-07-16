import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import { privateRoutes } from '../routes'
import { HOME_ROUTE } from '../utils/consts'
export const ContentRouter = () => {
	return (
		<Switch>
			{privateRoutes.map(({path, Component}, i)=>{
				return <Route path={path} component={Component} exact key = {path}/>
			})}
			<Redirect to={HOME_ROUTE} />
		</Switch>
	)
}
