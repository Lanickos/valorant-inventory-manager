import asyncio, traceback, json, logging

from ..randomizers.skin_randomizer import Skin_Randomizer
from ..sys_utilities.system import System
from ..broadcast import broadcast

from ..client_config import CLIENT_STATE_REFRESH_INTERVAL
from .. import shared 

logger = logging.getLogger('VIM_main')

class Client_State:

    def __init__(self):
        self.client = shared.client
        self.valclient = shared.client.client

        try:
            self.previous_presence = self.valclient.fetch_presence()
        except:
            self.previous_presence = {}
        self.presence = self.previous_presence
        shared.ingame = False
        self.inrange = False

    async def dispatch_randomizer(self):
        logger.debug("randomizing")
        await Skin_Randomizer.randomize()

    async def randomizer_check(self):
        if self.presence is not None and self.presence != {}:
            if (self.presence["sessionLoopState"] != self.previous_presence["sessionLoopState"]) and (self.previous_presence["sessionLoopState"] == "INGAME" and self.presence["sessionLoopState"] == "MENUS"):
                if shared.config["skin_randomizer"]["settings"]["auto_skin_randomize"]["value"] == True:
                    if self.inrange:

                        if shared.config["skin_randomizer"]["settings"]["randomize_after_range"]["value"] == True:
                            await self.dispatch_randomizer()
                            self.inrange = False
                        else:
                            self.inrange = False
                            return 
                    else:
                        await self.dispatch_randomizer()


    async def check_presence(self):
        self.previous_presence = self.presence 
        changed = False
        try:
            self.presence = self.valclient.fetch_presence()
            if self.presence["sessionLoopState"] == "INGAME" or self.presence["sessionLoopState"] == "PREGAME":
                shared.ingame = True
            else:
                shared.ingame = False

            if (self.presence["sessionLoopState"] != self.previous_presence["sessionLoopState"]):
                changed = True

            if self.presence["provisioningFlow"] == "ShootingRange":
                self.inrange = True

        except:
            shared.ingame = False 

        return changed

    async def check_game_running(self):
        await shared.client.check_connection()

    async def loop(self):
        while True:
            if System.are_processes_running():
                changed = await self.check_presence()
                await self.check_game_running()
                
                # check for randomizer
                await self.randomizer_check()

                if changed: #only need to broadcast this if the state actually changed
                    await Client_State.update_game_state()
            
                await asyncio.sleep(CLIENT_STATE_REFRESH_INTERVAL)
            
    async def update_game_state():
        payload = {
            "event": "game_state",
            "data": {
                "state": shared.ingame
            }
        }
        await broadcast(payload)
        return True