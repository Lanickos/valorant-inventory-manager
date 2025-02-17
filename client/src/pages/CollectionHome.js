import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import WeaponEditor from '../components/weaponEditor/WeaponEditor.js'
import Collection from '../components/collection/Collection.js'

import socket from "../services/Socket";
import { useLoadout } from "../services/useLoadout"
import { useInventory } from "../services/useInventory"

import { Grid, Container, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

}));


function CollectionHome(props) {

    const classes = useStyles();
    const theme = useTheme();

    const [loadout, forceUpdateLoadout] = useLoadout();
    const [inventory, forceUpdateInventory] = useInventory()

    const [loaded, setLoaded] = useState(false);
    const [showWeaponEditor, setWeaponEditorState] = useState(false);

    const [weaponEditor, setWeaponEditor] = useState();
    const [uniqueSkinsOwned, setUniqueSkinsOwned] = useState(-1);

    useEffect(() => {
        console.log(inventory)
    }, [])

    useEffect(() => {
        if (!showWeaponEditor) {
            document.title = "VIM // Collection"
        }
    }, [showWeaponEditor])

    useEffect(() => {
        // count how many skins are owned for skin changer warning dialog
        var unique = 0

        for (var weapon in inventory.skins) {
            var owned = {}
            for (var skin in inventory.skins[weapon].skins) {
                if(inventory.skins[weapon].skins[skin].unlocked){
                    owned[skin] = inventory.skins[weapon].skins[skin]
                }
            }
            console.log(owned)
            unique += Object.keys(owned).length - 1; //-1 for default skin
        }
        setUniqueSkinsOwned(unique);
    }, [inventory.skins])

    function modificationMenu(uuid) {
        console.log(inventory)
        setWeaponEditorState(true);
        setWeaponEditor(<WeaponEditor weaponUuid={uuid} initialSkinData={loadout[uuid]} inventoryData={inventory.skins} loadoutWeaponData={loadout[uuid]} saveCallback={saveCallback} closeEditor={closeEditor} />)
    };

    async function saveCallback(payload, sameSkin) {
        return new Promise((resolve, reject) => {

            function inventoryCallback(response) {
                forceUpdateInventory(response, "skins");
                resolve();
            }

            function putCallback(response) {
                console.log("put skin")
                forceUpdateLoadout(response);
            }

            payload = JSON.stringify(payload);
            socket.request({ "request": "update_skin_inventory", "args": { "payload": payload } }, inventoryCallback);
            if (!sameSkin) {
                socket.request({ "request": "put_weapon", "args": { "payload": payload } }, putCallback);
            }

        })

    }

    function closeEditor() {
        setWeaponEditorState(false);
        setWeaponEditor(null);
    }

    return (
        <div style={{ height: "100%", width: "100%", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "auto", flexGrow: 1 }}>
            {inventory.skins !== {} ?
                <Container maxWidth={false} style={{ display: "flex", height: "auto", flexGrow: 1, }}>
                    {weaponEditor}
                    <Collection style={{ padding: "10px 0px 10px 0px" }} weaponEditorCallback={modificationMenu} loadout={loadout} setLoadout={null} skinsOwned={uniqueSkinsOwned} />
                </Container>
                : null}
        </div>
    )
}


export default CollectionHome