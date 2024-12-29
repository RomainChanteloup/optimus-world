import { Canvas as R3FCanvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { DebugKeyboardControls, ThreeDebug } from '../debug';
import { Controls } from './controls';
import { Spinner } from './interface/spinner/spinner';

export const Canvas = ({ children, ...rest }: Parameters<typeof R3FCanvas>[0]) => {
    const [isLoading, setIsLoading] = useState(true);
    const [startClicked, setStartClicked] = useState(false);


    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleStartClick = (value: boolean) => {
        // user clicked to start button
        setStartClicked(value);
    };

    return (
        <>
            {!startClicked && <Spinner isLoading={isLoading} onStartClickedChange={handleStartClick} /> }
            <Suspense>
                <R3FCanvas
                    id="gl"
                    onCreated={handleLoad} // Triggered when everything is loaded
                    {...rest}
                >
                    {children}
                    <ThreeDebug />
                </R3FCanvas>
            </Suspense>


            <DebugKeyboardControls />
            <Controls />
        </>
    );
};
