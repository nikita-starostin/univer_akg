import React from 'react';
import { Route } from 'react-router-dom';
import Ipr1AnimationMorphing from './ipr1AnimationMorhing/Ipr1AnimationMorphing';
import Ipr2Clipping from './Ipr2Clipping/Ipr2Clipping';
import Kr1Clipping from './kr1Clipping/Kr1Clipping';
import Kr2_3d from './kr2_3d/Kr2_3d';


export default function AkgRouting(): React.ReactElement {
    return <>
        <Route exact
               path="/">
            <Ipr1AnimationMorphing/>
        </Route>
        <Route path="/ipr1AnimationMorphing">
            <Ipr1AnimationMorphing/>
        </Route>
        <Route path="/ipr2Clipping">
            <Ipr2Clipping/>
        </Route>
        <Route path="/kr1Clipping">
            <Kr1Clipping />
        </Route>
        <Route path="/kr2_3d">
            <Kr2_3d />
        </Route>
    </>;
}
