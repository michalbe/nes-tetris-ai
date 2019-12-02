## NES TETRIS AI

![screencast.gif](screencast.gif)

### Running

-   download Classic Tetris NES rom (I'm not sure about licensing of 30yo+ games, so I'm not including it in the repo. It's [very easy to find though](https://www.google.com/search?q=tetris+nes+rom))
-   save it as `public/roms/tetris.nes`
-   `npm i`
-   `npm run start`

### Moar

-   It's possible to move all the calculations to the Worker by setting `WORKER` to `true` in `src/connfig.ts`.
-   Even it logic in the workes is the same as the one for the browser'smain thread, I just copied the code (together with configuration) because I didn't want to spend time on forcing `imports` to work in the Worker (or `inportScripts` in the browser).
-   The algorithm isn't optimized for speed yet, so the non-blocking Worker version doesn't really work as expected
-   To skip the loading screen on each refresh:
    -   start the game
    -   pause it right after the first tetramino is visible (`Q`)
    -   run `nes.save(0)` in the console.
    -   `index.ts` will load previously saved state if available
    -   it's possible to have multiple starting points ("saves"), just increment the argument passed to the `load/save` methods
-   The best result I get so far was ~517k points, what was more than enough to qualify to [Classic Tetris World Championship](https://thectwc.com/) last year. 2019 threshold was ~650k, so we're not there yet ;).
-   **Feel free to open pull requests with improvements**.
