import { useReducer, useEffect, useRef, useMemo } from 'react';

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

var snapshotToData = function (snapshot, idField) {
    var _a;
    if (!snapshot.exists) {
        return undefined;
    }
    return __assign(__assign({}, snapshot.data()), (idField ? (_a = {}, _a[idField] = snapshot.id, _a) : null));
};

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
    var _a = useReducer(reducer(), defaultState(defaultValue)), state = _a[0], dispatch = _a[1];
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
    var ref = useRef(value);
    useEffect(function () {
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

var useCollection = function (query, options) {
    var _a = useLoadingValue(), error = _a.error, loading = _a.loading, reset = _a.reset, setError = _a.setError, setValue = _a.setValue, value = _a.value;
    var ref = useIsEqualRef(query, reset);
    useEffect(function () {
        if (!ref.current) {
            setValue(undefined);
            return;
        }
        var listener = options && options.snapshotListenOptions
            ? ref.current.onSnapshot(options.snapshotListenOptions, setValue, setError)
            : ref.current.onSnapshot(setValue, setError);
        return function () {
            listener();
        };
    }, [ref.current]);
    return [value, loading, error];
};
var useCollectionData = function (query, options) {
    var idField = options ? options.idField : undefined;
    var snapshotListenOptions = options
        ? options.snapshotListenOptions
        : undefined;
    var _a = useCollection(query, {
        snapshotListenOptions: snapshotListenOptions,
    }), snapshot = _a[0], loading = _a[1], error = _a[2];
    var values = useMemo(function () {
        return (snapshot
            ? snapshot.docs.map(function (doc) { return snapshotToData(doc, idField); })
            : undefined);
    }, [snapshot, idField]);
    return [values, loading, error];
};

var useCollectionOnce = function (query, options) {
    var _a = useLoadingValue(), error = _a.error, loading = _a.loading, reset = _a.reset, setError = _a.setError, setValue = _a.setValue, value = _a.value;
    var ref = useIsEqualRef(query, reset);
    useEffect(function () {
        if (!ref.current) {
            setValue(undefined);
            return;
        }
        ref.current
            .get(options ? options.getOptions : undefined)
            .then(setValue)
            .catch(setError);
    }, [ref.current]);
    return [value, loading, error];
};
var useCollectionDataOnce = function (query, options) {
    var idField = options ? options.idField : undefined;
    var getOptions = options ? options.getOptions : undefined;
    var _a = useCollectionOnce(query, { getOptions: getOptions }), value = _a[0], loading = _a[1], error = _a[2];
    return [
        (value
            ? value.docs.map(function (doc) { return snapshotToData(doc, idField); })
            : undefined),
        loading,
        error,
    ];
};

var useDocument = function (docRef, options) {
    var _a = useLoadingValue(), error = _a.error, loading = _a.loading, reset = _a.reset, setError = _a.setError, setValue = _a.setValue, value = _a.value;
    var ref = useIsEqualRef(docRef, reset);
    useEffect(function () {
        if (!ref.current) {
            setValue(undefined);
            return;
        }
        var listener = options && options.snapshotListenOptions
            ? ref.current.onSnapshot(options.snapshotListenOptions, setValue, setError)
            : ref.current.onSnapshot(setValue, setError);
        return function () {
            listener();
        };
    }, [ref.current]);
    return [value, loading, error];
};
var useDocumentData = function (docRef, options) {
    var idField = options ? options.idField : undefined;
    var snapshotListenOptions = options
        ? options.snapshotListenOptions
        : undefined;
    var _a = useDocument(docRef, {
        snapshotListenOptions: snapshotListenOptions,
    }), snapshot = _a[0], loading = _a[1], error = _a[2];
    var value = useMemo(function () { return (snapshot ? snapshotToData(snapshot, idField) : undefined); }, [snapshot, idField]);
    return [value, loading, error];
};

var useDocumentOnce = function (docRef, options) {
    var _a = useLoadingValue(), error = _a.error, loading = _a.loading, reset = _a.reset, setError = _a.setError, setValue = _a.setValue, value = _a.value;
    var ref = useIsEqualRef(docRef, reset);
    useEffect(function () {
        if (!ref.current) {
            setValue(undefined);
            return;
        }
        ref.current
            .get(options ? options.getOptions : undefined)
            .then(setValue)
            .catch(setError);
    }, [ref.current]);
    return [value, loading, error];
};
var useDocumentDataOnce = function (docRef, options) {
    var idField = options ? options.idField : undefined;
    var getOptions = options ? options.getOptions : undefined;
    var _a = useDocumentOnce(docRef, { getOptions: getOptions }), value = _a[0], loading = _a[1], error = _a[2];
    return [
        (value ? snapshotToData(value, idField) : undefined),
        loading,
        error,
    ];
};

export { useCollection, useCollectionData, useCollectionOnce, useCollectionDataOnce, useDocument, useDocumentData, useDocumentOnce, useDocumentDataOnce };
