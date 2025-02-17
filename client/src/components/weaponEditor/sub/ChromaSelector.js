import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Tooltip, Container, Typography, Toolbar, IconButton, Slide, AppBar } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import { Check } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({

}));


function ChromaSelector(props) {

    const classes = useStyles();

    const equippedChromaIndex = props.equippedChromaIndex.toString()
    const selectedSkinIsEquipped = props.selectedSkinIsEquipped
    const selectedLevelIndex = props.selectedLevelIndex.toString()
    const maxChroma = Object.keys(props.chromaData).length.toString();
    const maxLevel = Object.keys(props.levelData).length.toString();

    const [selectedChroma, setSelectedChroma] = useState(props.selectedChromaIndex.toString())

    function handleChromaChange(event, newLevel) {
        if (newLevel !== null) {
            setSelectedChroma(newLevel);
            var chromaData = Object.values(props.chromaData)[newLevel - 1]
            props.setter(chromaData)
        }
    }

    useEffect(() => {
        if (selectedLevelIndex !== maxLevel && selectedChroma !== 0) {
            setSelectedChroma("1");
            var chromaData = Object.values(props.chromaData)[0]
            props.setter(chromaData)
        }
    }, [selectedLevelIndex])

    useEffect(() => {
        setSelectedChroma(props.selectedChromaIndex.toString())
    }, [props.selectedChromaIndex])

    if (maxChroma !== "1"){
        console.log(selectedChroma)
        return (
            <div style={{ flexGrow: 1, width: "50%", display: "flex", flexDirection: "row", justifyContent: "flex-end", height: "45px", }}>
                <ToggleButtonGroup
                    value={selectedChroma}
                    exclusive
                    onChange={handleChromaChange}
                    aria-label="skin level"
                    style={{ width: "90%", height: "95%", justifyContent: "flex-end", marginLeft: 0 }}
                >
    
                    {Object.keys(props.chromaData).map(uuid => {
                        var data = props.chromaData[uuid]
                        var index = data.index.toString()
                        var equipped = index === equippedChromaIndex && selectedSkinIsEquipped 

                        if (data.swatch_icon !== null) {
                            return (
                                <Tooltip key={data.display_name} title={data.unlocked ? (data.favorite ? `Favorited - ${data.display_name}` : data.display_name) : `${data.display_name} (Locked)`} arrow>
                                    <ToggleButton selected={selectedChroma === index} value={index} aria-label={data.index} style={{ border: (data.favorite ? `1px #996D2D solid` : null) }}>
                                        <img alt={data.display_name} src={data.swatch_icon} style={{ width: "25px", height: "auto", zIndex: 1, }} />
                                        {equipped ? <Check style={{ width: "auto", height: "25px", position: "absolute", bottom: "", objectFit: "contain", alignSelf: "flex-end", margin: "auto", color: "#66bb6a", zIndex: 2, }} /> : null}
                                    </ToggleButton>
                                </Tooltip>
                            )
                        } else {
                            return null
                        }
                    })}
                </ToggleButtonGroup>
            </div>
        )
    } else {
        return null
    }
}

export default ChromaSelector;