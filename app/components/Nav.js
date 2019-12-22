import React from 'react'
import { ThemeConsumer } from '../contexts/theme'
import { NavLink } from 'react-router-dom'

const activeStyle = {
  color: 'rgb(187, 46, 31)'
}

export default function Nav () {
  return (
    <ThemeConsumer>
      {({ theme, toggleTheme }) => (
        <nav className='row space-between'>
          <ul className='row nav'>
            <li>
              <NavLink
                to='/'
                exact
                activeStyle={activeStyle}
                className='nav-link'>
                  Popular
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/battle'
                activeStyle={activeStyle}
                className='nav-link'>
                  Battle
              </NavLink>
            </li>
          </ul>
          {/* <div className="theme-switch-wrapper">
              <label className="theme-switch" for="checkbox">
                  <input type="checkbox" id="checkbox" onClick={toggleTheme} />
                  <div className="slider round"></div>
            </label>
            <em>Enable Dark Mode!</em>
          </div> */}
          <div className="toggle">
            <input type="checkbox" id="toggle" onClick={toggleTheme} />
            <label htmlFor="toggle"></label>
          </div>
        </nav>
      )}
    </ThemeConsumer>
  )
}