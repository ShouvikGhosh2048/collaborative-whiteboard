import { Link } from "wouter";

export default function Navbar() {
    return (
        <nav className="navbar px-3">
            <Link href="/" className="fs-5 fw-bold text-decoration-none text-black">
                Collaborative whiteboard 🎨
            </Link>
        </nav>
    );
}