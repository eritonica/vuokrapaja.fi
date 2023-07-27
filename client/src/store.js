import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';

/**
 * Configures and creates the Redux store for the application.
 * @function configureAppStore
 * @param {Object} preloadedState - The initial state to be loaded into the store.
 * @returns {Object} The Redux store with the specified appReducer and preloadedState.
 */
export default configureStore({
    reducer: {
        app: appReducer,
    },
});

