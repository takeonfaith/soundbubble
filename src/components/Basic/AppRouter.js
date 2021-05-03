import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import { AlbumPage } from '../../pages/AlbumPage'
import { AuthorPage } from '../../pages/AuthorPage'
import { DialoguePage } from '../../pages/DialoguePage'
import { privateRoutes, publicRoutes } from '../../routes'
import { HOME_ROUTE, LOGIN_ROUTE, NOTFOUND_ROUTE} from '../../utils/consts'
export const AppRouter = () => {
	const user = true
	return user ?
	(
		<Switch>
			<Route path={'/authors/:author'} component={AuthorPage} exact/>
			<Route path={'/albums/:album'} component={AlbumPage} exact/>
			<Route path={'/chat/:chatId'} component={DialoguePage} exact/>
			{privateRoutes.map(({path, Component}, i)=>{
				return <Route path={path} component={Component} exact = {true} key = {i}/>
			})}
			<Redirect to={HOME_ROUTE} />
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
