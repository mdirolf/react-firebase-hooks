'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var isObject = function (val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
};
var snapshotToData = function (snapshot, keyField) {
    var _a;
    if (!snapshot.exists) {
        return undefined;
    }
    var val = snapshot.val();
    if (isObject(val)) {
        return __assign(__assign({}, val), (keyField ? (_a = {}, _a[keyField] = snapshot.key, _a) : null));
    }
    return val;
};

var initialState = {
    loading: true,
    value: {
        keys: [],
        values: [],
    },
};
var listReducer = function (state, action) {
    switch (action.type) {
        case 'add':
            if (!action.snapshot) {
                return state;
            }
            return __assign(__assign({}, state), { error: undefined, value: addChild(state.value, action.snapshot, action.previousKey) });
        case 'change':
            if (!action.snapshot) {
                return state;
            }
            return __assign(__assign({}, state), { error: undefined, value: changeChild(state.value, action.snapshot) });
        case 'error':
            return __assign(__assign({}, state), { error: action.error, loading: false, value: {
                    keys: undefined,
                    values: undefined,
                } });
        case 'move':
            if (!action.snapshot) {
                return state;
            }
            return __assign(__assign({}, state), { error: undefined, value: moveChild(state.value, action.snapshot, action.previousKey) });
        case 'remove':
            if (!action.snapshot) {
                return state;
            }
            return __assign(__assign({}, state), { error: undefined, value: removeChild(state.value, action.snapshot) });
        case 'reset':
            return initialState;
        case 'value':
            return __assign(__assign({}, state), { error: undefined, loading: false });
        case 'empty':
            return __assign(__assign({}, state), { loading: false, value: {
                    keys: undefined,
                    values: undefined,
                } });
        default:
            return state;
    }
};
var addChild = function (currentState, snapshot, previousKey) {
    if (!snapshot.key) {
        return currentState;
    }
    var keys = currentState.keys, values = currentState.values;
    if (!previousKey) {
        // The child has been added to the start of the list
        return {
            keys: keys ? __spreadArrays([snapshot.key], keys) : [snapshot.key],
            values: values ? __spreadArrays([snapshot], values) : [snapshot],
        };
    }
    // Establish the index for the previous child in the list
    var index = keys ? keys.indexOf(previousKey) : 0;
    // Insert the item after the previous child
    return {
        keys: keys
            ? __spreadArrays(keys.slice(0, index + 1), [snapshot.key], keys.slice(index + 1)) : [snapshot.key],
        values: values
            ? __spreadArrays(values.slice(0, index + 1), [snapshot], values.slice(index + 1)) : [snapshot],
    };
};
var changeChild = function (currentState, snapshot) {
    if (!snapshot.key) {
        return currentState;
    }
    var keys = currentState.keys, values = currentState.values;
    var index = keys ? keys.indexOf(snapshot.key) : 0;
    return __assign(__assign({}, currentState), { values: values
            ? __spreadArrays(values.slice(0, index), [snapshot], values.slice(index + 1)) : [snapshot] });
};
var removeChild = function (currentState, snapshot) {
    if (!snapshot.key) {
        return currentState;
    }
    var keys = currentState.keys, values = currentState.values;
    var index = keys ? keys.indexOf(snapshot.key) : 0;
    return {
        keys: keys ? __spreadArrays(keys.slice(0, index), keys.slice(index + 1)) : [],
        values: values
            ? __spreadArrays(values.slice(0, index), values.slice(index + 1)) : [],
    };
};
var moveChild = function (currentState, snapshot, previousKey) {
    // Remove the child from it's previous location
    var tempValue = removeChild(currentState, snapshot);
    // Add the child into it's new location
    return addChild(tempValue, snapshot, previousKey);
};
var useListReducer = (function () { return react.useReducer(listReducer, initialState); });

var defaultState = function (defaultValue) {
    return {
        loading: defaultValue === undefined || defaultValue === null,
        value: defaultValue,
    };
};
var reducer = function () { return function (state, action) {
    switch (action.type) {
        case 'error':
            return __assign(__assign({}, state), { error: action.error, loading: false, value: undefined });
        case 'reset':
            return defaultState(action.defaultValue);
        case 'value':
            return __assign(__assign({}, state), { error: undefined, loading: false, value: action.value });
        default:
            return state;
    }
}; };
var useLoadingValue = (function (getDefaultValue) {
    var defaultValue = getDefaultValue ? getDefaultValue() : undefined;
    var _a = react.useReducer(reducer(), defaultState(defaultValue)), state = _a[0], dispatch = _a[1];
    var reset = function () {
        var defaultValue = getDefaultValue ? getDefaultValue() : undefined;
        dispatch({ type: 'reset', defaultValue: defaultValue });
    };
    var setError = function (error) {
        dispatch({ type: 'error', error: error });
    };
    var setValue = function (value) {
        dispatch({ type: 'value', value: value });
    };
    return {
        error: state.error,
        loading: state.loading,
        reset: reset,
        setError: setError,
        setValue: setValue,
        value: state.value,
    };
});

var useComparatorRef = function (value, isEqual, onChange) {
    var ref = react.useRef(value);
    react.useEffect(function () {
        if (!isEqual(value, ref.current)) {
            ref.current = value;
            if (onChange) {
                onChange();
            }
        }
    });
    return ref;
};
var isEqual = function (v1, v2) {
    var bothNull = !v1 && !v2;
    var equal = !!v1 && !!v2 && v1.isEqual(v2);
    return bothNull || equal;
};
var useIsEqualRef = function (value, onChange) {
    return useComparatorRef(value, isEqual, onChange);
};

var useList = function (query) {
    var _a = useListReducer(), state = _a[0], dispatch = _a[1];
    var ref = useIsEqualRef(query, function () { return dispatch({ type: 'reset' }); });
    var onChildAdded = function (snapshot, previousKey) {
        dispatch({ type: 'add', previousKey: previousKey, snapshot: snapshot });
    };
    var onChildChanged = function (snapshot) {
        dispatch({ type: 'change', snapshot: snapshot });
    };
    var onChildMoved = function (snapshot, previousKey) {
        dispatch({ type: 'move', previousKey: previousKey, snapshot: snapshot });
    };
    var onChildRemoved = function (snapshot) {
        dispatch({ type: 'remove', snapshot: snapshot });
    };
    var onError = function (error) {
        dispatch({ type: 'error', error: error });
    };
    var onValue = function () {
        dispatch({ type: 'value' });
    };
    react.useEffect(function () {
        var query = ref.current;
        if (!query) {
            dispatch({ type: 'empty' });
            return;
        }
        // This is here to indicate that all the data has been successfully received
        query.once('value', onValue, onError);
        query.on('child_added', onChildAdded, onError);
        query.on('child_changed', onChildChanged, onError);
        query.on('child_moved', onChildMoved, onError);
        query.on('child_removed', onChildRemoved, onError);
        return function () {
            query.off('child_added', onChildAdded);
            query.off('child_changed', onChildChanged);
            query.off('child_moved', onChildMoved);
            query.off('child_removed', onChildRemoved);
        };
    }, [ref.current]);
    return [state.value.values, state.loading, state.error];
};
var useListKeys = function (query) {
    var _a = useList(query), value = _a[0], loading = _a[1], error = _a[2];
    return [
        value ? value.map(function (snapshot) { return snapshot.key; }) : undefined,
        loading,
        error,
    ];
};
var useListVals = function (query, options) {
    var _a = useList(query), snapshots = _a[0], loading = _a[1], error = _a[2];
    var values = react.useMemo(function () {
        return snapshots
            ? snapshots.map(function (snapshot) {
                return snapshotToData(snapshot, options ? options.keyField : undefined);
            })
            : undefined;
    }, [snapshots, options && options.keyField]);
    return [values, loading, error];
};

var useObject = function (query) {
    var _a = useLoadingValue(), error = _a.error, loading = _a.loading, reset = _a.reset, setError = _a.setError, setValue = _a.setValue, value = _a.value;
    var ref = useIsEqualRef(query, reset);
    react.useEffect(function () {
        var query = ref.current;
        if (!query) {
            setValue(undefined);
            return;
        }
        query.on('value', setValue, setError);
        return function () {
            query.off('value', setValue);
        };
    }, [ref.current]);
    return [value, loading, error];
};
var useObjectVal = function (query, options) {
    var _a = useObject(query), snapshot = _a[0], loading = _a[1], error = _a[2];
    var value = react.useMemo(function () {
        return snapshot
            ? snapshotToData(snapshot, options ? options.keyField : undefined)
            : undefined;
    }, [snapshot, options && options.keyField]);
    return [value, loading, error];
};

exports.useList = useList;
exports.useListKeys = useListKeys;
exports.useListVals = useListVals;
exports.useObject = useObject;
exports.useObjectVal = useObjectVal;
