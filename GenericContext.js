import React from 'react';

import deepCopy from './tools';

import { filterAction } from './ActionsController';

import { AsyncStorage } from 'react-native';

export const AppContext = React.createContext();

export default function initContext(actions, ...data) {
    return class GenericContext extends React.PureComponent {

        constructor(props) {
            let context = Object.assign(...data);

            context.execute = (actionType, ...param) => {
                const action = filterAction(actionType, actions);
                this.executeAction(action, param);
            };

            super(props);
            this.state = context;
        }

        executeAction(action, param) {
            if (action.request === null) {
                if (param.length === 0) {
                    this.setStateAndUpdateAsyncStorage(null, action.functionalSetState);
                } else if (param.length === 1) {
                    this.setStateAndUpdateAsyncStorage(param[0], action.functionalSetState);
                } else if (param.length > 1) {
                    this.setStateAndUpdateAsyncStorage(param, action.functionalSetState);
                }

            } else {
                if (param.length === 0) {
                    this.apiRequest(action.request, action.functionalSetState)
                } else if (param.length === 1) {
                    this.apiRequest(action.request, action.functionalSetState, param[0]);
                } else if (param.length > 1) {
                    this.apiRequest(action.request, action.functionalSetState, param);
                }
            }
        }

        apiRequest(request, functionalSetState, param) {
            request(this.setStateAndUpdateAsyncStorage.bind(this), functionalSetState, param);
        }

        setStateAndUpdateAsyncStorage(data, functionalSetState) {
            this.setState(functionalSetState(this.state, data), () => {
                const newState = deepCopy(this.state);
                this.setAsyncStorage(newState)
                console.log("Context in async storage updated to: ", newState);
            });
        }

        getContextFromAsyncStorage() {
            this.getAsyncStorage()
                .then(asyncStorageContext => this.setState(asyncStorageContext))           
        }

        async getAsyncStorage() {
            try {
                const retrievedItem = await AsyncStorage.getItem('context_test');
                const item = JSON.parse(retrievedItem);
                return item;
              } catch (error) {
                console.log('Error retrieving async storage: ', error.message);
              }
              return
        }

        async setAsyncStorage(newState) {
            try {
                await AsyncStorage.setItem('context_test', JSON.stringify(newState));
            } catch (error){
                console.log('Error setting async storage: ', error);
            }
        }

        componentDidMount() {
            this.getContextFromAsyncStorage();
        }

        render() {
            return (
                <AppContext.Provider value={this.state}>
                    {this.props.children}
                </AppContext.Provider>
            );
        }

    }
}