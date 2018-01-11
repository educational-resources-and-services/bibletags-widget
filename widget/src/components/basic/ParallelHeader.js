import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'

const Primary = styled.div`
  padding: 15px 15px 0;
  margin-bottom: -8px;
  font-size: 13px;
  color: #777;
`

const Secondary = styled.div`
  font-size: 11px;
  display: inline-block;
  margin-left: 4px;
`

class ParallelHeader extends React.Component {
  render() {
    const { primary, secondary } = this.props 

    return (
      <Primary>
        {primary}
        {secondary && <Secondary>{i18n("+ {{secondary}}", { secondary })}</Secondary>}
      </Primary>
    )
  }

}

export default ParallelHeader