import React from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'

const StyledButton = styled(Button)`

  padding: 0 10px !important;
  min-width: 0 !important;
  min-height: 0 !important;
  height: 30px !important;
  border-radius: 0 !important;
  vertical-align: top;
  box-shadow: none !important;
  border-right: 1px solid #CCC !important;

  &.depressed {
    background: #333 !important;
    color: white;
  }

  &:first-child {
    border-radius: 3px 0 0 3px !important;
  }

  &:last-child {
    border-radius: 0 3px 3px 0 !important;
    border-right: 0 !important;
  }

`

class SwitchButton extends React.Component {
  render() {
    const { selected, disabled, makeSelected, children } = this.props 

    return (
      <StyledButton
        variant="contained"
        className={selected ? "depressed" : ""}
        disabled={disabled || selected ? true : false}
        onClick={makeSelected}
      >
        {children}
      </StyledButton>
    )
  }

}

export default SwitchButton