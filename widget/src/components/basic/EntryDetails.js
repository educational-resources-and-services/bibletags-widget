import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'

import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton'
import LibraryBooksIcon from 'material-ui-icons/LibraryBooks'

const DetailsLine = styled.div`
  padding-top: 10px;
`

const Definition = styled.div`
  font-size: 15px;
  font-weight: bold;
  display: inline-block;
  margin-right: 3px;
`

const PartOfSpeech = styled.div`
  font-size: 14px;
  display: inline-block;
`

const IconButtonStyled = styled(IconButton)`
  margin: -100px 0 !important;
  vertical-align: middle;
`

class EntryWord extends React.Component {
  render() {
    const { something } = this.props 

    return (
      <DetailsLine>
        <Definition>beginning</Definition>
        <span> </span>
        <PartOfSpeech>noun</PartOfSpeech>
        <IconButtonStyled
          aria-label="Lexicon"
          onTouchTap={() => {}}
        >
          <LibraryBooksIcon />
        </IconButtonStyled>
      </DetailsLine>
    )
  }

}

export default EntryWord