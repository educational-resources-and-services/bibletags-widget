import React from 'react'
import styled from 'styled-components'

const SwitchButtonsCont = styled.div`
  margin: auto 0;
  border-radius: 3px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
`

class SwitchButtons extends React.Component {
  
  render() {
    const { className, selectedId, setSelectedId, children } = this.props 

    return (
      <SwitchButtonsCont className={className}>
        {React.Children.map(children, child => (
          React.cloneElement(child, {
            selected: child.props.id === selectedId,
            makeSelected: () => setSelectedId(child.props.id),
          })
        ))}
      </SwitchButtonsCont>
    )
  }

}

export default SwitchButtons