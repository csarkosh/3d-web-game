import React from 'react'
import VideoPreviewer from "./VideoPreviewer";
import Glance from "./Glance";
import GameLauncher from "./GameLauncher";
import Categories from "./Categories";
import LinearProgress from './LinearProgress'
import * as serviceWorker from './serviceWorker';
const Game = React.lazy(() => import('./Game'))

/**
 * @param {Object.<String, *>} state
 * @param {Function} setState
 * @return {Function}
 */
const popStateHandler = (state, setState) => () => setState({ ...state, pathname: window.location.pathname })

/**
 * @param {Object.<String, *>} state
 * @param {Function} setState
 * @return {Function}
 */
const gameMountHandler = (state, setState) => () => {
    setState({ ...state, loading: false })
    window.history.pushState(null, null, '/game')
}

/**
 * @param {Object.<String, *>} state
 * @param {Function} setState
 * @return {Function}
 */
const beforeInstallHandler = (state, setState) => e => setState({ ...state, installPrompt: e })


let listenersSet = false

function App() {
    const [state, setState] = React.useState({
        installPrompt: null,
        loading: false,
        pathname: window.document.location.pathname,
    })
    React.useEffect(() => {
        if (!listenersSet) {
            listenersSet = true
            if ((window.location.search || '').includes('sv')) {
                serviceWorker.register();
            } else {
                serviceWorker.unregister();
            }
            window.addEventListener('popstate', popStateHandler(state, setState), {passive: true})
            window.addEventListener('beforeinstallprompt', beforeInstallHandler(state, setState), {passive: true})
        }
    }, [state, setState])
    return (
        <React.Fragment>
            {(state.pathname !== '/game' || state.loading) && (
                <React.Fragment>
                    <header className="navbar">
                        <section className="navbar-section">
                            <a href="/" className="navbar-brand mr-2 text-primary">
                                3D Web Game
                            </a>
                        </section>
                        <LinearProgress style={{ opacity: state.loading ? 1 : 0 }}/>
                    </header>
                    <div className="store-wrapper">
                        <div className="store-group">
                            <VideoPreviewer />
                            <Glance />
                        </div>
                        <div className="store-group h-safe-inset">
                            <GameLauncher
                                installEnabled={Boolean(state.installPrompt)}
                                onBrowserLaunch={() => {
                                    setState({ ...state, pathname: '/game', loading: true })
                                }}
                                onInstall={() => {}}
                            />
                            <Categories />
                        </div>
                    </div>
                </React.Fragment>
            )}
            {state.pathname === '/game' && (
                <React.Suspense fallback={<React.Fragment />}>
                    <Game onMount={gameMountHandler(state, setState)} />
                </React.Suspense>
            )}
        </React.Fragment>
    )
}

export default App
