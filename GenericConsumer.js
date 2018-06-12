import React from 'react';

import { AppContext } from './GenericContext';

export default function withContext(Component) {
    return function ComponentWithContext(props) {
        return(
            <AppContext.Consumer>
                { context => <Component {...props} context={context}/>}
            </AppContext.Consumer>
        );
    }
}