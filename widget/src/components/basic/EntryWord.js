import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'

import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton'
import SearchIcon from 'material-ui-icons/Search'

const WordLine = styled.div`
  padding-right: 40px;
`

const Lemma = styled.div`
  font-size: 17px;
  display: inline-block;
  margin-right: 3px;
`

const Pronounciation = styled.div`
  font-size: 15px;
  color: rgba(0,0,0,.5);
  display: inline-block;
  margin-right: 3px;
`

const Strongs = styled.div`
  font-size: 14px;
  display: inline-block;
  margin-right: 3px;
`

const Hits = styled.div`
  font-size: 13px;
  color: rgba(0,0,0,.5);
  display: inline-block;
`

const IconButtonStyled = styled(IconButton)`
  position: absolute !important;
  top: 0;
  right: 0;
`

class EntryWord extends React.Component {
  render() {
    const { id, lemma, vocal, hits } = this.props

    let strongs = id.split('-')[0]
    strongs = strongs.substr(0,1) + parseInt(strongs.substr(1))

    return (
      <WordLine>
        <Lemma className="hebrewFont">{lemma}</Lemma>
        <span> </span>
        <Pronounciation>{vocal}</Pronounciation>
        <span> </span>
        <Strongs>{strongs}</Strongs>
        <span> </span>
        <Hits>{i18n("{{hits}}x", { hits })}</Hits>
        {/* <IconButtonStyled
          aria-label="Search"
          onTouchTap={() => {}}
        >
          <SearchIcon />
        </IconButtonStyled> */}
      </WordLine>
    )
  }

}

export default EntryWord