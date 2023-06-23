import { render, screen } from '@testing-library/react'
import TestToast from '../pages/testToast/index.js'
import {wrapper} from "../store/store";
import {createMockedSessionProvider,createMockedSession} from 'next-auth/mo'
import {store} from "..";

describe('testToast', () => {
    it('renders a heading', () => {

        render(
            <Provider store={store}> {/* Enveloppez le composant avec le <Provider> */}
                <TestToast />
            </Provider>
        );

        // Le reste de votre test...
    });
});