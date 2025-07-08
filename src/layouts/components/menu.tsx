import { Link, useLocation } from 'react-router'

const routes = [
  {
    icon: 'Home',
    label: 'Home',
    path: '/',
  },
]

export const Menu = () => {
  const location = useLocation()

  return (
    <ul className="menu">
      {routes.map(({ icon, label, path }) => (
        <li
          key={path}
          className={location.pathname === path ? 'active' : ''}>
          <Link
            to={path}
            className="tooltip tooltip-right"
            data-tip={label}>
            {icon}
          </Link>
        </li>
      ))}
    </ul>
  )
}
