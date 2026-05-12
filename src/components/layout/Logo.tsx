import { Link } from 'wouter'

export const Logo: React.FC = () => (
    <Link href="/">
        <a href="/" className="flex items-center">
            <img className="h-8 w-auto" src="/wayland-explorer-cn/logo.svg" alt="Logo" />
            <span
                className="font-semibold ml-2 truncate"
                title="Wayland Explorer"
            >
                Wayland Explorer
            </span>
        </a>
    </Link>
)
