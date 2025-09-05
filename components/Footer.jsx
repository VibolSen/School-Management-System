export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} University Management System. All rights reserved.
                </p>
                <p className="text-sm mt-2">
                    Built with ❤️ by the Development Team.
                </p>
            </div>
        </footer>
    );
}