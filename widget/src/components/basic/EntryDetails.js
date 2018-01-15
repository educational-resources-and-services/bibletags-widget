import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'

import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton'
import LibraryBooksIcon from 'material-ui-icons/LibraryBooks'

import { posTerms } from '../../utils/helperFunctions.js'

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
    const { gloss, pos } = this.props 

    return (
      <DetailsLine>
        <Definition>{gloss}</Definition>
        <span> </span>
        <PartOfSpeech>{pos.map(onePos => posTerms[onePos]).join(i18n(", ", {}, "list separator"))}</PartOfSpeech>
        {/* <IconButtonStyled
          aria-label="Lexicon"
          onTouchTap={() => {}}
        >
          <LibraryBooksIcon />
        </IconButtonStyled> */}
      </DetailsLine>
    )
  }

}

export default EntryWord