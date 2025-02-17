import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Grid } from '@material-ui/core'

import LoadoutProfile from "./sub/LoadoutProfile";

function Loadouts(props) {

    return (
        <>
            <div style={{ height: "60px", width: "90%", marginX: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", overflow: "auto", }}>
                header with buttons or something
            </div>

            <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={3} style={{ height: "auto", width: "90%", }}>

                <Grid item xs={12} lg={3} style={{ height: "auto", width: "100%", margin: "auto" }}>
                    <LoadoutProfile />
                </Grid>
                <Grid item xs={12} lg={3} style={{ height: "auto", width: "100%", margin: "auto" }}>
                    <LoadoutProfile />
                </Grid>
                <Grid item xs={12} lg={3} style={{ height: "auto", width: "100%", margin: "auto" }}>
                    <LoadoutProfile />
                </Grid>
                <Grid item xs={12} lg={3} style={{ height: "auto", width: "100%", margin: "auto" }}>
                    <LoadoutProfile />
                </Grid>
                <Grid item xs={12} lg={3} style={{ height: "auto", width: "100%", margin: "auto" }}>
                    <LoadoutProfile />
                </Grid>
                <Grid item xs={12} lg={3} style={{ height: "auto", width: "100%", margin: "auto" }}>
                    <LoadoutProfile />
                </Grid>
                <Grid item xs={12} lg={3} style={{ height: "auto", width: "100%", margin: "auto" }}>
                    <LoadoutProfile />
                </Grid>
                

            </Grid>
        </>
    )
}

export default Loadouts;