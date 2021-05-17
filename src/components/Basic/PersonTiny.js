import React from 'react'

export const PersonTiny = ({data, ...restProps}) => {
	return (
		<div className="person" {...restProps}>
			<div className="pesronImg">
				<img src={data.photoURL} alt="" />
			</div>
			<div className="personName">
				{data.displayName}
			</div>
		</div>
	)
}
