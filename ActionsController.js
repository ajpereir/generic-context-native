export default function createAction(request, functionalSetState) {
    return {
        request: request,
        functionalSetState: functionalSetState
    }
}

export function filterAction (actionType, actions) {
    return actions[actionType];
}