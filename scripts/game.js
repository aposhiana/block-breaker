MyGame.game = (function() {
    'use strict';

}());

let defaultScreen = (function(game) {
    'use strict';

    function initialize() {
        
    }

    function run() {
        // Does nothing
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game));

MyGame.screens['main-menu'] = defaultScreen;
MyGame.screens['credits'] = defaultScreen;
MyGame.screens['high-scores'] = defaultScreen;
