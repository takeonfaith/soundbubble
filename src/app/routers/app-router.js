import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { useAuth } from '../../contexts/auth'
import { publicRoutes } from '../routes'
import { LOGIN_ROUTE } from '../../shared/data/consts'
import { ContentWrapper } from '../../shared/ui/content-wrapper'

export const AppRouter = () => {
	const { currentUser } = useAuth()
	return currentUser.uid ?
		(
			<Switch>
				<Route path='/' component={ContentWrapper} />
			</Switch>
		) :
		(
			<Switch>
				{publicRoutes.map(({ path, Component }, i) => {
					return <Route path={path} component={Component} exact={true} key={i} />
				})}
				<Redirect to={LOGIN_ROUTE} />
			</Switch>
		)
}
