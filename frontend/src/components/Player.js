import GameList from "./GameList"
import Card from "../ui/Card"
import PageSwitcher from "../ui/PageSwitcher"
import LoadingOverlay from "../ui/LoadingOverlay"
import SelectedPlayerContext from "../store/selectedPlayerContext"
import { useContext, useEffect } from "react"

const Player = (props) => {
    const selectedPlayerCtx = useContext(SelectedPlayerContext)

    // fetch new data when the player or page is changed or player's live games end or finish
    const firstLiveGame = props.liveGames[0]
    useEffect(() => {
        selectedPlayerCtx.setPlayer(props.player)
    }, [props.player, selectedPlayerCtx.page, firstLiveGame])

    return (
        <Card className={props.className}>
            <div>
                <h1>{props.player.name}</h1>
                {props.liveGames.length !== 0 ? (
                    <div>
                        <GameList
                            games={props.liveGames}
                            player={selectedPlayerCtx.player.name}
                        />
                    </div>
                ) : null}

                <GameList
                    games={selectedPlayerCtx.games}
                    player={selectedPlayerCtx.player.name}
                    selectPlayer={props.selectPlayer}
                >
                    <PageSwitcher
                        page={selectedPlayerCtx.page}
                        pageCount={selectedPlayerCtx.pageCount}
                        pageUp={selectedPlayerCtx.pageUp}
                        pageUpUp={selectedPlayerCtx.pageUpUp}
                        pageDown={selectedPlayerCtx.pageDown}
                        pageDownDown={selectedPlayerCtx.pageDownDown}
                    >
                        <LoadingOverlay active={!selectedPlayerCtx.dataReady} />
                    </PageSwitcher>
                </GameList>
            </div>
            <LoadingOverlay active={selectedPlayerCtx.loading} />
        </Card>
    )
}
export default Player
