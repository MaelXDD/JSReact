import { FiMapPin, FiMail, FiPhone, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'

export default function Footer() {
    return (
        <footer className="bg-[#1a1b1e] text-gray-400 py-12 border-t border-[#2b2d31]">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">

                <div className="space-y-4">
                    <h2 className="text-2xl font-black text-[#ed4245] uppercase tracking-widest">PHANTOM</h2>
                    <p className="text-sm max-w-sm">
                        Tu tienda gamer de confianza en Perú. Especialistas en consolas, videojuegos y accesorios al mejor precio.
                    </p>
                    <div className="flex gap-4 text-xl">
                        <button type="button" className="bg-transparent border-none p-0 hover:text-[#ed4245] transition-colors"><FiFacebook /></button>
                        <button type="button" className="bg-transparent border-none p-0 hover:text-[#ed4245] transition-colors"><FiInstagram /></button>
                        <button type="button" className="bg-transparent border-none p-0 hover:text-[#ed4245] transition-colors"><FiTwitter /></button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-white uppercase text-sm tracking-wider">Contacto</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                            <FiMapPin className="text-[#ed4245]" /> Lima, Perú
                        </li>
                        <li className="flex items-center gap-2">
                            <FiMail className="text-[#ed4245]" /> soporte@phantom.pe
                        </li>
                        <li className="flex items-center gap-2">
                            <FiPhone className="text-[#ed4245]" /> +51 999 888 777
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-[#2b2d31] text-center text-xs text-gray-600">
                 {new Date().getFullYear()} Phantom. Todos los derechos reservados.
            </div>
        </footer>
    )
}