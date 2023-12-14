import { NavLink } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { useLocalState } from '../../hooks/useStorage'
import IconSun from '../icons/IconSun'
import IconMoon from '../icons/IconMoon'
import { prefersDark } from '../../scripts/util'
import Button from '../Button'
import useWindowPos from '../../hooks/useWindowPos'
import IconArrowUp from '../icons/IconArrowUp'

const links = [
  { label: 'Recipes', to: 'recipes' },
  { label: 'Ingredients', to: 'ingredients' },
  { label: 'Add Recipe', to: 'create' },
  { label: 'User', to: '' },
]

const root = document.querySelector(':root')!

export function Navigation() {
  // Default value will be set to the user's preferred theme
  // And later on this default value will be ignored for the cached one
  const [dark, setDark] = useLocalState('theme', prefersDark())

  useEffect(() => {
    if (dark)
      root.classList.add('dark-theme')
    else
      root.classList.remove('dark-theme')
  }, [dark])

  // Scroll up
  const { y } = useWindowPos()
  const showScrollUp = useMemo(() => {
    return y > (window.innerHeight * 0.3)
  }, [y])

  return (
    <header className="main-navigation">
      <div className="wrapper">
        <NavLink to="/recipes" className="logo-wrap">
          <img src="/brand/logo.png" alt="" />
        </NavLink>

        <div className="flex-1"></div>

        <nav role="navigation">
          <ul aria-label="Main Navigation" role="navigation">
            {links.map(link => (
              <li key={link.to}>
                <NavLink to={link.to}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1"></div>

        <Button classes="btn-hover btn-icon" data-title-bottom="Change Theme" onClick={() => setDark(!dark)}>
          {dark ? <IconSun /> : <IconMoon />}
        </Button>
      </div>

      {showScrollUp && (
        <Button classes="btn-scroll-up" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} data-title-left="Scroll up">
          <IconArrowUp />
        </Button>
      )}
    </header>
  )
}
