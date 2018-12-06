import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'

const Primary = styled.div`
  padding: 15px 15px 0;
  margin-bottom: -8px;
  font-size: 13px;
  color: #777;
`

const Secondary = styled.span`
  font-size: 11px;
`

class ParallelHeader extends React.Component {
  render() {
    const { headings } = this.props 

    const preppedHeadings = headings
      .reduce((accumulator, value, index) => [
        ...accumulator,
        <span key={index}>{i18n(" + ", {}, "combination character")}</span>,
        value,
      ], [])
      .slice(1)

    return (
      <Primary>
        {preppedHeadings[0]}
        <Secondary>{preppedHeadings.slice(1)}</Secondary>
      </Primary>
    )
  }

}

export default ParallelHeader