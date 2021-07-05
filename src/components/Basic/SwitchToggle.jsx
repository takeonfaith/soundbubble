import React from 'react'

export const SwitchToggle = ({boolValue, setBoolValue}) => {
	return (
		<div className = "SwitchToggle" onClick = {()=>setBoolValue(!boolValue)}>
			<div className="switchInnerCircle" style = {boolValue?{transform:'translateX(100%)', background:'var(--green)'}:{}}></div>
		</div>
	)
}
