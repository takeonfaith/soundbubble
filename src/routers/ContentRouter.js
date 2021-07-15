import React, { useEffect } from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import { AlbumPage } from '../pages/AlbumPage'
import { AuthorPage } from '../pages/AuthorPage'
import { DialoguePage } from '../pages/DialoguePage'
import { PageNotFound } from '../pages/PageNotFound'
import { privateRoutes, publicRoutes } from '../routes'
import { HOME_ROUTE, LOGIN_ROUTE, NOTFOUND_ROUTE} from '../utils/consts'
export const ContentRouter = () => {
	return (
		<Switch>
			<Route path={'/authors/:authorId'} component={AuthorPage} exact/>
			<Route path={'/albums/:albumId'} component={AlbumPage} exact/>
			<Route path={'/chat/:chatId'} component={DialoguePage} exact/>
			<Route path={NOTFOUND_ROUTE} component={PageNotFound} exact/>
			{privateRoutes.map(({path, Component}, i)=>{
				return <Route path={path} component={Component} exact key = {i}/>
			})}
			<Redirect to={HOME_ROUTE} />
		</Switch>
	)
}
