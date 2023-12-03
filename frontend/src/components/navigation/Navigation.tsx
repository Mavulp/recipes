import { NavLink } from 'react-router-dom'

const links = [
  {
    label: 'Recipes',
    to: 'recipes',
  },
  {
    label: 'Add Recipe',
    to: 'create',
  },
  {
    label: 'User',
    to: '',
  },
]

export function Navigation() {
  return (
    <header className="main-navigation">
      <div className="wrapper">
        <div className="logo-wrap">
          <img src="/brand/logo.png" alt="" />
        </div>

        <div className="flex-1"></div>

        <nav role="navigation">
          <ul>
            { links.map(link => (
              <li key={link.to}>
                <NavLink to={link.to}>{link.label}</NavLink>
              </li>
            )) }
          </ul>
        </nav>
      </div>
    </header>
  )
}
