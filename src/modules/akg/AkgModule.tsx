import React from 'react';
import { BrowserRouter, NavLink, Switch } from 'react-router-dom';
import AkgRouting from './pages/AkgRouting';
import './akgModule.css';

export default function AkgModule(): React.ReactElement {
    return <BrowserRouter>
        <div className='px-4 pt-3'>
            <NavLink activeClassName='active-link'
                     to='/ipr1AnimationMorphing'
                     className='mr-2'>
                ИПР 1 - Анимация и морфинг |
            </NavLink>
            <NavLink activeClassName='active-link'
                     to='/ipr2Clipping'
                     className='mr-2'>
                ИПР 2 - Отсечение прямоугольным окном |
            </NavLink>
            <NavLink activeClassName='active-link'
                     to='/kr1Clipping'
                     className='mr-2'>
                КР1 - Отсечение непрямоугольным окном |
            </NavLink>
            <NavLink activeClassName='active-link'
                     to='/kr2_3d'
                     className='mr-2'>
                КР2 - 3D
            </NavLink>
            <Switch>
                <div className='px-4 pt-3'>
                    <AkgRouting/>
                </div>
            </Switch>
        </div>
    </BrowserRouter>
}
