
const Input = (() => {
    let target,
        keyCode,
        keyCount = 0,
        keyState = [],
        prevKeyState = [],
        changed = [];

        keyState[37] = 0;
        keyState[38] = 0;
        keyState[39] = 0;
        keyState[40] = 0;

    const keydown = (e) => {
        keyCode = e.keyCode;
        keyState[e.keyCode] = true;
        // e.preventDefault();
    }

    const keyup = (e) => {
        keyCode = 0;
        keyState[e.keyCode] = false;
        // e.preventDefault();
    }

    return {
        bind: (t = document) => {
            target = t;
            target.addEventListener('keydown', keydown);
            target.addEventListener('keyup', keyup);
        },
        unbind: () => {
            target.removeEventListener('keydown', keydown);
            target.removeEventListener('keyup', keyup);
        },
        getKeyDown: (k) => {
            return changed[k] & keyState[k]
        },
        getKeyCode: function() {
            return keyCode;
        },
        getAnyKey: () => {
            return keyCount > 0;
        },
        getKey: (k) => {
            return keyState[k];
        },
        getKeyUp: (k) => {
            return changed[k] & !keyState[k];
        },
        getAxisX: () => {
            return keyState[39] - keyState[37];
        },
        getAxisY: () => {
            return keyState[40] - keyState[38];
        },
        update: () => {
            keyCount = 0;
            for(let k in keyState) {
                changed[k] = keyState[k] ^ prevKeyState[k];
                prevKeyState[k] = keyState[k];
                keyCount += changed[k] & keyState[k];
            }
        }
    };
})();

// export { Input };
