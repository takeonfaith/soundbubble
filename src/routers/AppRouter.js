import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import { ContentWrapper } from '../components/Basic/ContentWrapper'
import { useAuth } from '../contexts/AuthContext'
import { publicRoutes } from '../routes'
import { LOGIN_ROUTE} from '../utils/consts'
export const AppRouter = () => {
	const {currentUser} = useAuth()
	return currentUser.uid ?
	(
		<Switch>
			<Route path='/' component = {ContentWrapper} />
		</Switch>
	):
	(
		<Switch>
			{publicRoutes.map(({path, Component}, i)=>{
				return <Route path={path} component={Component} exact = {true} key = {i}/>
			})}
			<Redirect to={LOGIN_ROUTE} />
		</Switch>
	)
}
